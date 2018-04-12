import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { InterceptedHttp } from '../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';




/**
 * Author: Diamond Khanna ( 352929 )
 * Date: 09-10-2017
 * Objective: # A service which would handle the INSTITUTE DIRECTORY MASTER services.
 */

@Injectable()
export class InstituteDirectoryMasterService {
	admin_Base_Url: any;

	get_State_Url: any;
	get_Service_Url: any;
	get_InstituteDirectory_Url: any;
	save_InstituteDirectory_Url: any;
	edit_InstituteDirectory_Url: any;
	toggle_activate_InstituteDirectory_Url: any;
	getServiceLines_new_url: any;
	getStates_new_url: any;

	constructor(private http: SecurityInterceptedHttp,
		public basepaths: ConfigService,
		private httpIntercept: InterceptedHttp) {
		this.admin_Base_Url = this.basepaths.getAdminBaseUrl();

		this.get_State_Url = this.admin_Base_Url + 'm/role/state';
		this.get_Service_Url = this.admin_Base_Url + 'm/role/service';
		this.get_InstituteDirectory_Url = this.admin_Base_Url + 'm/getInstituteDirectory';
		this.save_InstituteDirectory_Url = this.admin_Base_Url + 'm/createInstituteDirectory';
		this.edit_InstituteDirectory_Url = this.admin_Base_Url + 'm/editInstituteDirectory';
		this.toggle_activate_InstituteDirectory_Url = this.admin_Base_Url + 'm/deleteInstituteDirectory';

		this.getServiceLines_new_url = this.admin_Base_Url + 'm/role/serviceNew';
		this.getStates_new_url = this.admin_Base_Url + 'm/role/stateNew';
	};

	getStates(serviceProviderID) {
		return this.http.post(this.get_State_Url, { 'serviceProviderID': serviceProviderID })
			.map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}
	getStatesNew(obj) {
		return this.httpIntercept.post(this.getStates_new_url,obj).map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}
	getServices(serviceProviderID, stateID) {
		return this.http.post(this.get_Service_Url, {
			'serviceProviderID': serviceProviderID,
			'stateID': stateID
		}).map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}
	getServiceLinesNew(userID) {
		return this.httpIntercept.post(this.getServiceLines_new_url, { 'userID': userID })
			.map(this.handleState_n_ServiceSuccess)
			.catch(this.handleError);
	}
	getInstituteDirectory(providerServiceMapID) {
		console.log('psmID', providerServiceMapID);
		return this.httpIntercept.post(this.get_InstituteDirectory_Url,
			{ 'providerServiceMapId': providerServiceMapID }).map(this.handleSuccess).catch(this.handleError);
	}

	saveInstituteDirectory(data) {
		console.log('save Institute Directory', data);
		return this.httpIntercept.post(this.save_InstituteDirectory_Url, data).map(this.handleSuccess).catch(this.handleError);
	}

	editInstituteDirectory(data) {
		return this.httpIntercept.post(this.edit_InstituteDirectory_Url, data).map(this.handleSuccess).catch(this.handleError);
	}

	toggle_activate_InstituteDirectory(data) {
		console.log(data, 'delete req obj');
		return this.httpIntercept.post(this.toggle_activate_InstituteDirectory_Url, data).map(this.handleSuccess).catch(this.handleError);
	}


	handleSuccess(res: Response) {
		console.log(res.json().data, 'INSTITUTE-DIRECTORY file success response');
		if (res.json().data) {
			return res.json().data;
		} else {
			return Observable.throw(res.json());
		}
	}

	handleState_n_ServiceSuccess(response: Response) {

		console.log(response.json().data, 'role service file success response');
		let result = [];
		result = response.json().data.filter(function (item) {
			if (item.statusID !== 4) {
				return item;
			}
		});
		return result;
	}

	handleError(error: Response | any) {
		return Observable.throw(error.json());
	}
};



