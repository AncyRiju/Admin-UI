import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderAdminRoleService } from "../services/ProviderAdminServices/state-serviceline-role.service";
import { dataService } from '../services/dataService/data.service';
import { ZoneMasterService } from '../services/ProviderAdminServices/zone-master-services.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-zone-district-mapping',
  templateUrl: './zone-district-mapping.component.html'
})
export class ZoneDistrictMappingComponent implements OnInit {

  userID: any;
  service: any;
  zoneID: any;
  state: any;
  data: any;
  providerServiceMapID: any;
  service_provider_id: any;
  checkExistDistricts: any;
  zoneDistrictMappingObj: any;
  editZoneMappingValue: any;
  createdBy: any;

  editable: any = false;
  showMappings: any = false;

  bufferCount: any = 0;
  count: any = 0;

  /* array*/
  disableSelection: boolean = false;
  showListOfZonemapping: boolean = true;
  availableZoneDistrictMappings: any = [];
  services: any = [];
  states: any = [];
  availableZones = [];
  districts: any = [];
  mappedDistricts: any = [];
  districtID: any = [];
  existingDistricts: any = [];
  zoneDistrictMappingList: any = [];
  mappedDistrictIDs: any = [];
  availableDistricts = [];
  bufferDistrictsArray: any = [];
  dataObj: any = {};

  @ViewChild('zoneDistrictMappingForm') zoneDistrictMappingForm: NgForm;
  constructor(public providerAdminRoleService: ProviderAdminRoleService,
    public commonDataService: dataService,
    public zoneMasterService: ZoneMasterService,
    private alertMessage: ConfirmationDialogsService) {
    this.data = [];
    this.service_provider_id = this.commonDataService.service_providerID;
    this.createdBy = this.commonDataService.uname;
  }

  ngOnInit() {
    this.userID = this.commonDataService.uid;
    this.getServiceLines();

  }
  getServiceLines() {
    this.zoneMasterService.getServiceLinesNew(this.userID).subscribe((response) => {
      this.getServicesSuccessHandeler(response),
        (err) => {
          console.log("ERROR in fetching serviceline", err);
          // this.alertMessage.alert(err, 'error');
        }
    });
  }
  getServicesSuccessHandeler(response) {
    this.services = response;
  }
  getStates(value) {
    let obj = {
      'userID': this.userID,
      'serviceID': value.serviceID,
      'isNational': value.isNational
    }
    this.zoneMasterService.getStatesNew(obj).
      subscribe((response) => {
        this.getStatesSuccessHandeler(response),
          (err) => {
            console.log("error in fetching states", err);
          }
      });

  }

  getStatesSuccessHandeler(response) {
    this.states = response;
  }
  setProviderServiceMapID(providerServiceMapID) {
    this.availableZones = [];
    this.providerServiceMapID = providerServiceMapID
    this.getAvailableZoneDistrictMappings();

  }
  getAvailableZoneDistrictMappings() {
    this.zoneMasterService.getZoneDistrictMappings({ "providerServiceMapID": this.providerServiceMapID }).subscribe(response => this.getZoneDistrictMappingsSuccessHandler(response));
  }

  getZoneDistrictMappingsSuccessHandler(response) {
    this.availableZoneDistrictMappings = response;
    this.showMappings = true;
    console.log("this.availableZoneDistrictMappings", this.availableZoneDistrictMappings);

  }

  showForm() {
    debugger;
    this.showMappings = false;
    this.disableSelection = true;
    this.showListOfZonemapping = false;
    //this.availableZones=[];
    this.getAvailableZones(this.state.providerServiceMapID);

  }
  getAvailableZones(providerServiceMapID) {
    debugger;
    console.log("zoneID", this.zoneID);
    
    this.zoneMasterService.getZones({ "providerServiceMapID": providerServiceMapID }).subscribe(response => this.getZonesSuccessHandler(response));
  }
  getZonesSuccessHandler(response) {
    this.availableZones = response;
    // if (response != undefined) {
    //   for (let zone of response) {
    //     if (!zone.deleted) {
    //       this.availableZones.push(zone);
    //     }
    //   }
    // }
    if (this.editZoneMappingValue != undefined) {
      if (this.availableZones) {
        let zone = this.availableZones.filter((availableZonesRes) => {
          if (this.editZoneMappingValue.zoneID == availableZonesRes.zoneID) {
            return availableZonesRes;
          }
        })[0];
        if (zone) {
          this.zoneID = zone;
          let state = Object.assign({ 'stateID': this.editZoneMappingValue.m_providerServiceMapping.state.stateID, 'providerServiceMapID': this.editZoneMappingValue.providerServiceMapID })
          console.log('state', state);

          this.checkZone(this.editZoneMappingValue.zoneID,
            this.editZoneMappingValue.m_providerServiceMapping.m_serviceMaster,
            state);

        }
      }

    }
  }

  checkZone(zoneID, service, stateID) {
    this.getDistricts(zoneID, service, stateID);
  }

  getDistricts(zoneID, service, stateID) {
    this.zoneMasterService.getDistricts(stateID.stateID).subscribe(response => this.getDistrictsSuccessHandeler(response, zoneID, service, stateID));

  }
  getDistrictsSuccessHandeler(response, zoneID, service, stateID) {

    this.districts = response;
    if (this.districts) {
      this.checkExistance(service, zoneID, stateID);
    }
    if (this.editZoneMappingValue != undefined) {
      if (this.districts) {
        let district = this.districts.filter((districtsRes) => {
          if (this.editZoneMappingValue.districtID == districtsRes.districtID && this.editZoneMappingValue.zoneID === this.zoneID.zoneID) {
            return districtsRes;
          }
        })[0];
        if (district) {
          this.districtID = district;
            this.availableDistricts.push(district);
        }
      }

    }

  }


  checkExistance(service, zoneID, stateID) {
    this.districtID = [];
    this.existingDistricts = [];

    this.availableZoneDistrictMappings.forEach((zoneDistrictMappings) => {
      if (zoneDistrictMappings.providerServiceMapID != undefined && zoneDistrictMappings.providerServiceMapID == stateID.providerServiceMapID && zoneDistrictMappings.zoneID != undefined && zoneDistrictMappings.zoneID == zoneID) {
        if (!zoneDistrictMappings.deleted) {
          this.existingDistricts.push(zoneDistrictMappings.districtID);
        }
      }
    });

    this.availableDistricts = this.districts.slice();

    let temp = [];
    this.availableDistricts.forEach((district) => {
      let index = this.existingDistricts.indexOf(district.districtID);
      if (index < 0) {
        temp.push(district);
      }
    });

    this.availableDistricts = temp.slice();
    if (this.zoneDistrictMappingList.length > 0) {
      this.zoneDistrictMappingList.forEach((zoneDistrictMappings) => {
        if (zoneDistrictMappings.zoneID != undefined && zoneDistrictMappings.zoneID == zoneID) {
          if (!zoneDistrictMappings.deleted) {
            this.bufferDistrictsArray.push(zoneDistrictMappings.districtID)
          }
        }
      });

      let temp = [];
      this.availableDistricts.forEach((district) => {
        let index = this.bufferDistrictsArray.indexOf(district.districtID);
        if (index < 0) {
          temp.push(district);
        }
      });

      this.availableDistricts = temp.slice();
      this.bufferDistrictsArray = [];
    }
  }

  addZoneDistrictMappingToList(values) {
    console.log("values", values);

    for (let districts of values.districtID) {
      let districtId = districts.districtID;

      this.zoneDistrictMappingObj = {};
      this.zoneDistrictMappingObj.zoneID = values.zoneID.zoneID;
      this.zoneDistrictMappingObj.zoneName = values.zoneID.zoneName;
      this.zoneDistrictMappingObj.districtID = districtId;
      this.zoneDistrictMappingObj.districtName = districts.districtName;
      this.zoneDistrictMappingObj.providerServiceMapID = values.zoneID.providerServiceMapID;
      this.zoneDistrictMappingObj.stateID = this.state.stateID;
      this.zoneDistrictMappingObj.stateName = this.state.stateName;
      this.zoneDistrictMappingObj.serviceID = this.service.serviceID;
      this.zoneDistrictMappingObj.createdBy = this.createdBy;
      this.zoneDistrictMappingList.push(this.zoneDistrictMappingObj);
      this.zoneDistrictMappingForm.resetForm();
      this.resetDropdowns();
      console.log('buffer', this.zoneDistrictMappingList);
    }
  }

  remove_obj(index) {
    let service = this.zoneDistrictMappingList[index].serviceID;
    let state = this.zoneDistrictMappingList[index];
    let zoneID = this.zoneDistrictMappingList[index].zoneID;
    this.checkZone(zoneID, service, state);
    this.zoneDistrictMappingList.splice(index, 1);
    this.zoneDistrictMappingForm.resetForm();
    this.resetDropdowns();
  }
  resetDropdowns() {
    this.availableDistricts = [];
    //this.availableZones = [];
  }

  storezoneMappings() {
    console.log(this.zoneDistrictMappingList);
    let obj = { "zoneDistrictMappings": this.zoneDistrictMappingList };
    this.zoneMasterService.saveZoneDistrictMappings(JSON.stringify(obj)).subscribe(response => this.successHandler(response));
  }

  successHandler(response) {
    this.zoneDistrictMappingList = [];
    this.alertMessage.alert("Mapping saved successfully", 'success');
    this.showList();
  }
  showList() {
    this.getAvailableZoneDistrictMappings();
    this.editable = false;
    this.disableSelection = false;
    this.showListOfZonemapping = true;
    this.showMappings = false;
  }
  updateZoneMappingStatus(zoneMapping) {

    let flag = !zoneMapping.deleted;
    let status;
    if (flag === true) {
      status = "Deactivate";
    }
    if (flag === false) {
      status = "Activate";
    }

    this.alertMessage.confirm('Confirm', "Are you sure you want to " + status + "?").subscribe(response => {
      if (response) {
        this.dataObj = {};
        this.dataObj.zoneDistrictMapID = zoneMapping.zoneDistrictMapID;
        this.dataObj.deleted = !zoneMapping.deleted;
        this.dataObj.modifiedBy = this.createdBy;
        this.zoneMasterService.updateZoneMappingStatus(this.dataObj).subscribe(response => this.updateStatusHandler(response));

        zoneMapping.deleted = !zoneMapping.deleted;
      }
      this.alertMessage.alert(status + "d successfully", 'success');
    });
  }
  updateStatusHandler(response) {
    console.log("Zone District Mapping status changed", response);
  }

  back() {
    debugger;
    this.alertMessage.confirm('Confirm', "Do you really want to cancel? Any unsaved data would be lost").subscribe(res => {
      if (res) {
        debugger;
        this.zoneDistrictMappingForm.resetForm();
        this.resetDropdowns();
        this.showList();
        this.zoneDistrictMappingList = [];
        this.bufferCount = 0;
      }
    })
  }

  editZoneMapping(zoneDistrictMapping) {
    console.log("zoneDistrictMapping", zoneDistrictMapping);

    this.editable = true;
    this.showMappings = false;
    this.disableSelection = true;
    this.showListOfZonemapping = false;
    this.editZoneMappingValue = zoneDistrictMapping;
    this.getAvailableZones(zoneDistrictMapping.providerServiceMapID);



  }

  updateZoneMappingData(ZoneMapping) {
    console.log("ZoneMapping", ZoneMapping);

    this.dataObj = {};
    this.dataObj.zoneID = this.zoneID.zoneID;
    this.dataObj.districtID = this.districtID.districtID;
    this.dataObj.providerServiceMapID = this.editZoneMappingValue.providerServiceMapID;
    this.dataObj.zoneDistrictMapID = this.editZoneMappingValue.zoneDistrictMapID;
    this.dataObj.modifiedBy = this.createdBy;
    console.log("data", this.dataObj);

    this.zoneMasterService.updateZoneMappingData(this.dataObj).subscribe((response) => {
      console.log("updated response", response);
      this.updateHandler(response)
    });
  }
  updateHandler(response) {    
    //this.initializeObj(); 
    this.resetDropdowns();
    this.showList();
    this.editZoneMappingValue = null;
    this.alertMessage.alert("Updated successfully", 'success');

  }

  initializeObj() {
   
    this.districtID = null;
    this.zoneID = null;
    
  }
}
