import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  Activity_Number:any;

	show(value)
  	{
  		this.Activity_Number=value;
  	}

}
