import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AddressComponent } from './components/address/address.component';
import { AddAddressComponent } from './components/address/add-address/add-address.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { EditAddressComponent } from './components/address/edit-address/edit-address.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { UserComponent } from './components/user/user.component';
import { BankComponent } from './components/bank/bank.component';
import { AddProductComponent } from './components/product-management/add-product/add-product.component';

const routes: Routes = [
  { path: '', redirectTo: '/managements', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'favourite', component: FavouriteComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'address', component: AddressComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'address/add', component: AddAddressComponent },
  { path: 'address/edit', component: EditAddressComponent },
  { path: 'favourite', component: FavouriteComponent },
  { path: 'managements', component: ProductManagementComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  { path: 'bank', component: BankComponent },
  { path: 'managements/add', component: AddProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
