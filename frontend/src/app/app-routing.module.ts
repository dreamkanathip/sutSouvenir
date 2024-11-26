import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AddressComponent } from './components/address/address.component';
import { AddAddressComponent } from './components/address/add-address/add-address.component';
import { EditAddressComponent } from './components/address/edit-address/edit-address.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  {
    path: 'favourite',
    component: FavouriteComponent,
  },
  {
    path: 'details/:id',
    component: ProductDetailsComponent,
  },
  { path: 'address', component: AddressComponent },
  {
    path: 'address/add',
    component: AddAddressComponent,
  },
  {
    path: 'address/edit',
    component: EditAddressComponent,
  },
  {
    path: 'managements',
    component: ProductManagementComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
