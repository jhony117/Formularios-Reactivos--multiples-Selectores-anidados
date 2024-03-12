import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';


const routes : Routes = [
{
  path: '',
  children: [
    {path : 'selector', component : SelectorPageComponent},
    {path : '**', redirectTo : 'selector'},
  ]
 }
];

// const routes: Routes = [

//   {
//     path: 'selector',
//     component : SelectorPageComponent
//   },
//   {
//     path : '**',
//     redirectTo : 'selector',
//   }
// ];

@NgModule({
  declarations: [], //? solo hay un for root en toda la app, los demas son for child
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountriesRoutingModule { }



