import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry, Country } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion: SmallCountry[] = [];
  public borders : SmallCountry[] = [];

   public myForm:FormGroup = this.fb.group({
    region : ['', Validators.required],
    country : ['', Validators.required],
    border : ['', Validators.required],
   })


  constructor (private fb:FormBuilder,
               private countriesService:CountriesService) {}

  ngOnInit(): void {
    this.onRegionChanges();
    this.onCountryChanged();
  }

  get regions(): Region[] {
      return this.countriesService.regions;
  }

  onRegionChanges():void {

   this.myForm.get('region')!.valueChanges
   .pipe(   //? inveestiga : .value es de solo lectura ??
    tap(() => this.myForm.get('country')!.setValue('')),
    tap(() => this.borders = []),
    switchMap(region => this.countriesService.getContriesByRegion(region))
   )
      .subscribe(countries => {
          this.countriesByRegion = countries;
      })
  }


  onCountryChanged()  {
    this.myForm.get('country')!.valueChanges
    .pipe(   //? inveestiga : .value es de solo lectura ??
     tap(() => this.myForm.get('border')!.setValue('')),
    filter((value :string) => value.length > 0 ), //? filter de rxjs , si es que esta funcion regresa falso lo de abajo a esta no se ejecuta
      switchMap( (alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
      switchMap(country => this.countriesService.getCountryBorderByCodes(country.borders))
    )
     .subscribe(countries => {
        this.borders = countries
      })
  }


}
