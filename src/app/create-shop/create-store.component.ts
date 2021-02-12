import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApisService} from '../core/services/apis.service';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.css']
})
export class CreateStoreComponent implements OnInit {
  @ViewChild('closebox') closebox: HTMLElement;
  createShopForm: FormGroup;
  locationList: Array<any>;
  locationValues: any;
  userSelectedLocation: any;
  formatedAddress:any;
  hideModal:boolean
  isLoading:boolean
  locationName:any
  constructor( private fb: FormBuilder, private api: ApisService) { }

  ngOnInit(): void {
    this.locationList = [];
    this.initialiseCreateShopForm();
    this.hideModal=false
    this.isLoading=true
  }


  initialiseCreateShopForm(): any{
    this.createShopForm = this.fb.group({
      shopName: ['', [Validators.required]],
      shopOwner: ['', [Validators.required]],
      category: ['General Store', [Validators.required]],
      location: ['', [Validators.required]],
    });
  }

  createShop(): any{
    let payload = {}
    payload = {
      "category": this.createShopForm.get('category').value.split(' ').join('').toUpperCase(),
      "latitude": this.locationValues.lat,
      "longitude": this.locationValues.lng,
      "name": this.createShopForm.get('shopName').value,
      "ownerName": this.createShopForm.get('shopOwner').value,
      "locationName":this.locationName
    }
    console.log('payload is herer ::::: ',this.createShopForm.get('location'))
    this.isLoading = false
    this.api.createStore(payload).subscribe( res => {
      setTimeout(function(){this.isLoading=true;window.location.reload() }, 3000)
    })
  }

  // Get List of Locations
  getGeoLocationList(event): any{
    console.log('=======================')
    const userInput = event.target.value;
    this.api.getGeoLocationData(userInput).subscribe((res) => {
      let temp = [];
      temp = [{
        locationName:res.results[0].formatted_address,
        locationCordinates:res.results[0].geometry.location
      }]
      this.locationList = temp
      this.locationValues = res.results[0].geometry.location;
      console.log(this.locationList);
      console.log(res);
      console.log('location values :::',this.locationValues);
    },
      (err) => {
          this.locationList = [];
      });
  }

  storeLocation(location): void{
    console.log('location is here ::::::::: ',location);
    this.createShopForm.patchValue({location: location.locationName});
    this.userSelectedLocation = location;
    this.locationName = location.locationName
    this.locationList = [];
  }

  closeBox(): void{
    this.createShopForm.reset();
  }

  get shopName(): any { return this.createShopForm.get('shopName'); }
  get shopOwner(): any { return this.createShopForm.get('shopOwner'); }
  get category(): any { return this.createShopForm.get('category'); }
  get location(): any { return this.createShopForm.get('location'); }

}
