import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LandingPage} from './landing-page/landing-page.component';

const routes: Routes = [
    {path: '', component: LandingPage, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
