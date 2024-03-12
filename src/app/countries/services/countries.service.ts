import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableNotification, combineLatest, map, of, pipe, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private baseUrl : string = 'http://restcountries.com/v3.1';

  private _regions: Region[] =[Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];


  constructor(
   private http:HttpClient

  ) { }

  get regions(): Region[] {//? se hace de esta manera para que no se modifique la data original
    return [...this._regions];
  }


  getContriesByRegion(region : Region):Observable<SmallCountry[]>{

  if(!region) return of([]);

  const url: string =`${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url)
    .pipe(
      map(countries => countries.map( country => ({
        name : country.name.common,
        cca3 : country.cca3,
        borders : country.borders  ?? [] //? operador de covalencia nula , investigar
      }) ) ),
      tap(resp => console.log({resp}))
    )
      }

      getCountryByAlphaCode(alphaCode:string):Observable<SmallCountry>{

        // if(!alphaCode) return of();

  console.log(alphaCode);
        const url = `${this.baseUrl}/alpha/${alphaCode}/?field=cca3,name,borders`;
        return this.http.get<Country[]>(url)
        .pipe(
          tap(country => console.log(country)), //! ¿POR QUE REGRESA UN ARREGLO DE COUNTRYS ????
          map(country => ({
            name :   country[0].name.common,
            cca3:    country[0].cca3,
            borders: country[0].borders ??  [],
          })),
          tap(() =>    console.log(alphaCode)),
          tap(country => console.log({country})),
        )
      }

      getCountryBorderByCodes(borders:string[]):Observable<SmallCountry[]>{

        if(!borders || borders.length === 0) return of([]);

        const countriesRequest:Observable<SmallCountry>[]= [];

        borders.forEach(code => {
          const request = this.getCountryByAlphaCode(code);
          countriesRequest.push(request);
        });
              //? combineLstest emite hasta que todos los observables emitan un valor , todos se disparan a la vez
        return combineLatest(countriesRequest);
      }
}
