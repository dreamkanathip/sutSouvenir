import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
<<<<<<< HEAD
import { ProductDetailsComponent } from './components/product-details/product-details.component';
=======
import { AddressComponent } from './components/address/address.component';
import { AddAddressComponent } from './components/address/add-address/add-address.component';
>>>>>>> 4bfce029bb716f7d21de38c35a1aa2356e30a8bd

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
<<<<<<< HEAD
  { path: '', component: FavouriteComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'details/:id', component: ProductDetailsComponent}
=======
  { path: 'favourite', component: FavouriteComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'address', component: AddressComponent },
  { path: 'addAddress', component: AddAddressComponent },
>>>>>>> 4bfce029bb716f7d21de38c35a1aa2356e30a8bd
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
