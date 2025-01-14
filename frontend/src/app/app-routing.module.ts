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
import { AdminHistoryComponent } from './components/admin-history/admin-history.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AdminUpdateOrderStatusComponent } from './components/admin-update-order-status/admin-update-order-status.component';
import { UserStorageComponent } from './components/user-storage/user-storage.component';
import { ReviewComponent } from './components/review/review.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'favourite', component: FavouriteComponent },
  { path: 'address', component: AddressComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'address/add', component: AddAddressComponent },
  { path: 'address/edit', component: EditAddressComponent },
  { path: 'admin/management', component: ProductManagementComponent },
  { path: 'user', component: UserComponent },
  { path: 'bank', component: BankComponent },
  { path: 'admin/historyPay', component: AdminHistoryComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'superadmin/register/admin', component: RegisterAdminComponent },
  {
    path: 'superadmin/dashboard',
    component: SuperAdminDashboardComponent,
  },
  { path: 'admin/add/product', component: AddProductComponent },
  { path: 'admin-order', component: AdminUpdateOrderStatusComponent},
  // { path: "**", redirectTo: '/home'},
  { path: 'user/storage', component: UserStorageComponent },
  { path: 'review/:id', component: ReviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
