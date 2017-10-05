import { Component, OnInit } from '@angular/core';
import { CallTypeSubtypeService } from "../services/ProviderAdminServices/calltype-subtype-master-service.service";
import { dataService } from '../services/dataService/data.service';
declare var jQuery: any;


@Component({
	selector: 'app-call-disposition-type-master',
	templateUrl: './call-disposition-type-master.component.html',
	styleUrls: ['./call-disposition-type-master.component.css']
})
export class CallDispositionTypeMasterComponent implements OnInit {

	service_provider_id: any;
	providerServiceMapID: any;
	// ngmodels 
	state: any;
	service: any;

	callType: any;
	callSubType: any;
	fitToBlock: boolean=false;
	fitForFollowup: boolean=false;


	// api related 
	request_array: any;
	request_object: any;

	temporarySubtypeArray: any = [];

	// arrays
	data: any;
	provider_states: any = [];
	provider_services: any = [];

	

	// flags
	showTable: boolean;
	showForm: boolean;
	showCallType : boolean = false;
	tempCorrespondingSubCallType : any = [];
	subCallTypeExist : boolean = false;

	constructor(public callTypeSubtypeService: CallTypeSubtypeService,
				public commonDataService: dataService) {
		this.data = [];
		this.service_provider_id =this.commonDataService.service_providerID;
		this.providerServiceMapID = "";

		this.showTable = false;
		this.showForm = false;
	 }

	ngOnInit() {
		this.callTypeSubtypeService.getStates(this.service_provider_id).subscribe(response=>this.getStatesSuccessHandeler(response));

		this.request_array = [];
		this.request_object={
			"callGroupType": "",
			"callType1": [],
			
			// "callTypeDesc": "call type desc 1",
			// "fitToBlock": "1",
			// "fitForFollowup": "1",
			"createdBy": "Diamond Khanna"
		}
	}

	// data getters and setters for the component
	getServices(stateID)
	{
		this.showTable = false;
		this.callTypeSubtypeService.getServices(this.service_provider_id,stateID).subscribe(response => this.getServicesSuccessHandeler(response));
	}

	setProviderServiceMapID(providerServiceMapID){
		this.providerServiceMapID = providerServiceMapID;
		this.get_calltype_subtype_history();

	}
	disableSelect: boolean = false;
	hideTable(flag) {	

		this.disableSelect = flag;
		this.showTable = !flag;
		this.showForm = flag;
		// if (flag) {
		// 	jQuery("#addingSubTypes").trigger("reset");
		// 	debugger;
		// }
		this.callType = "";
		this.callSubType = "";
		this.subCallTypeExist = false;
		this.temporarySubtypeArray = [];
	}

	hideForm()
	{
		this.showTable = true;
		this.showForm = false;
	}

	reset()
	{
		this.callSubType = "";
		this.temporarySubtypeArray = [];
		this.fitToBlock=false;
		this.fitForFollowup= false;
	}

	pushCallSubType(callType,call_subtype, fitToBlock, fitForFollowup)
	{
		let obj={
			"callGroupType": callType,
			"callType": call_subtype,
			"providerServiceMapID":this.providerServiceMapID,
			"callTypeDesc": call_subtype,
			"fitToBlock": fitToBlock,
			"fitForFollowup": fitForFollowup,
			"createdBy": "Diamond Khanna"
		}
		console.log('dummy obj', obj);

		// if(this.temporarySubtypeArray.length==0)
		// {
		// 	this.temporarySubtypeArray.push(obj);
		// 	console.log("value pushed1");
		// }
		// else
		// {
		// 	let count = 0;
		// 	for (let i = 0; i < this.temporarySubtypeArray.length;i++)
		// 	{
		// 		if (this.temporarySubtypeArray[i].call_subtype === call_subtype)
		// 		{
		// 			count = count + 1;
		// 			console.log(count, "count");
		// 		}
		// 	}
		// 	if(count<1)
		// 	{
		//		this.temporarySubtypeArray.push(obj);
		// 		console.log("value pushed2");
		// 	}
		// 	else{
		// 		alert("value exists in buffer array");
		// 	}
		// }


		// resetting fields
		this.temporarySubtypeArray.push(obj);
		this.callSubType = "";
		this.fitToBlock = false;
		this.fitForFollowup = false;

	}

	removeFromCallSubType(index)
	{
		this.temporarySubtypeArray.splice(index, 1);
		console.log(this.temporarySubtypeArray);
	}

	save()
	{
		// this.request_object = {
		// 	"callGroupType": this.callType,
		// 	"callType1": this.temporarySubtypeArray,
		// 	"createdBy": "Diamond Khanna"
		// }
		// this.request_array.push(this.request_object);
		// console.log(this.request_array, "requested array");
		this.callTypeSubtypeService.saveCallTypeSubtype(this.temporarySubtypeArray).subscribe(response=>this.saveCallTypeSubTypeSuccessHandeler(response));
	}

	
	// CRUD
	get_calltype_subtype_history()
	{
		this.showTable = true;
		this.callTypeSubtypeService.getCallTypeSubType(this.providerServiceMapID).subscribe(response => this.getCallTypeSubTypeSuccessHandeler(response));
	}




	// successhandelers

	getStatesSuccessHandeler(response)
	{
		this.provider_states = response;
	}

	getServicesSuccessHandeler(response) {
	
		this.service = "";
		this.provider_services = response.filter(function(obj){
				return obj.serviceID == 1 || obj.serviceID == 3;
		});
	}

	getCallTypeSubTypeSuccessHandeler(response)
	{

		console.log("call type subtype history", response);
		this.data = response;

		
	}

	saveCallTypeSubTypeSuccessHandeler(response)
	{
		console.log(response, "save call type sub type success");
		this.hideTable(false) // going back to table view
		
		// resetting the ngmodels  
		this.reset();
		this.callType = "";
		this.request_array = [];

		
		this.get_calltype_subtype_history(); // refreshing the table contents

	}

	callTypeSelected(callType) {
		this.tempCorrespondingSubCallType = [];
		this.callSubType = "";
		this.showCallType = true;
		this.tempCorrespondingSubCallType = this.data.filter(function(obj){
				return obj.callGroupType == callType;
		});
		console.log(this.data);
		console.log(this.tempCorrespondingSubCallType);
	}
	callSubTypes(value) {
		
		let a:boolean=false;
		let b:boolean=false;
		for(var i=0; i<this.tempCorrespondingSubCallType.length; i++) {
			if(value.toLowerCase() == this.tempCorrespondingSubCallType[i].callType.toLowerCase()) {
				this.subCallTypeExist = true;
				a = true;
				break;
			}
			else {
				 a = false;
			}
		}
		for(var i=0; i<this.temporarySubtypeArray.length; i++) {
			if(value.toLowerCase() == this.temporarySubtypeArray[i].callType.toLowerCase()) {
				this.subCallTypeExist = true;
				b = true;
				break;
			}
			else {
				 b = false;
			}
		}
		if(a == false && b == false) {
			this.subCallTypeExist = false;
		}
	}
	fitToBlocks(flag) {
		if(flag) {
			this.fitForFollowup = false;
		}
	}
	fitForFollowups(flag) {
		if(flag) {
			this.fitToBlock = false;
		}
	}
	deleteSubCallType(callTypeID) {
		this.callTypeSubtypeService.deleteSubCallType(callTypeID).subscribe(response=>this.deletedSuccess(response));

	}
	deletedSuccess(res) {
		this.get_calltype_subtype_history();
		console.log(res);
	}
}
