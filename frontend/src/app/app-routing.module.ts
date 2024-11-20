import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AddressComponent } from './components/address/address.component';
import { AddAddressComponent } from './components/address/add-address/add-address.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: '', component: FavouriteComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'favourite', component: FavouriteComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'address', component: AddressComponent },
  { path: 'addAddress', component: AddAddressComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
