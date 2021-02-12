import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {ApisService} from '../core/services/apis.service';
import {HttpParams} from "@angular/common/http";
import {config} from "../config/config";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  @ViewChild('checked', {static: true}) checked;
  @ViewChild('searchValue', {static: true}) searchValue;
  createShopForm: FormGroup;
  shopListData: Array<any>;
  totalPage: number;
  inputValue: string;
  isShow: boolean;
  pageNumber: number;
  pageSize: number;
  isDisabled:boolean;
  isListDisabled:boolean;
  locationList: Array<any>;
  locationCords: any
  constructor(private fb: FormBuilder,private apiService: ApisService) { }

  ngOnInit(): void {
    this.shopListData = [];
    this.pageNumber=0;
    this.pageSize=10
    this.getAllShops();
    this.locationList = [];
    this.isDisabled=false;
    this.initialiseCreateShopForm();
    this.isListDisabled=false
  }

  initialiseCreateShopForm(): any{
    this.createShopForm = this.fb.group({
      location: ['', [Validators.required]],
    });
  }

  getAllShops(): any{
    let params = new HttpParams();
    this.apiService.getShopDetails(null,this.pageNumber,this.pageSize).subscribe( res => {
      this.shopListData = res.content;
      console.log('total page in this :',res.totalPages);
      console.log('total page in this :',this.shopListData);
      this.totalPage = res.totalPages
    })
  }

  prev(): void {
    this.pageNumber -= 1;
    this.apiService.getShopDetails(null, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListData = res.content;
    });
  }

  next(): void {
    this.pageNumber += 1;
    this.apiService.getShopDetails(null, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListData = res.content;
    });
  }

  nextForSearchByParams(): void {
    this.pageNumber += 1;
    this.apiService.searchStore({latitude:this.locationCords.lat,longitude:this.locationCords.lng}, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListData = res.content;
    });
  }

  prevForSearchByParams(): void {
    this.pageNumber -= 1;
    this.apiService.searchStore({latitude:this.locationCords.lat,longitude:this.locationCords.lng}, this.pageNumber, this.pageSize).subscribe((res) => {
      this.shopListData = res.content;
    });
  }

  searchShops(event): void{
    console.log("INPUT::::", this.inputValue)
    let payload = {};
    console.log('name is :::',event.target.shopSearch.value)
    payload = {
      name: event.target.shopSearch.value
    }

    this.apiService.searchStore(payload,0,10).subscribe((res) => {
      this.shopListData = res.content;
      this.totalPage = res.totalPages;
    });

  }
  toggleInput(): void {
    // if(event.target.checked){
    //   this.isDisabled=true
    // }else{
    //   this.isDisabled=false
    // }
    console.log('this.isdisabled :::::: ',this.isDisabled);
    this.isDisabled=!this.isDisabled
    this.getAllShops()
  }

  getGeoLocationList(event): any{
    console.log('===========================')
    const userInput = event.target.value;
    this.isListDisabled=true
    this.apiService.getGeoLocationData(userInput).subscribe((res) => {
        let temp = [];
        temp = [{
          locationName:res.results[0].formatted_address,
          locationCordinates:res.results[0].geometry.location
        }]
      this.locationList = temp
      this.locationCords = res.results[0].geometry.location

      },
      (err) => {
      });
  }
  storeLocation(location): void{
    console.log('location is here ::::::::: ',location);
    this.isListDisabled=false
    this.createShopForm.patchValue({location: location.locationName});
    this.apiService.searchStore({latitude:location.locationCordinates.lat,longitude:location.locationCordinates.lng},0,10).subscribe((res) => {
      console.log('responseeeeeeeeeeeeee::::', res)
      this.shopListData = res.content;
      this.totalPage = res.totalPages;
    })
    this.locationList = [];
  }

  resetSearch(searchValue): void {
    console.log('searchValue::::::::::',searchValue,' and :::: this search ::',this.searchValue)
    this.pageSize = 10;
    this.pageNumber = 0;
    this.isShow = false;
    this.inputValue = '';
    this.createShopForm.patchValue({location: ''});
    this.getAllShops();
  }

  get location(): any { return this.createShopForm.get('location'); }

}
