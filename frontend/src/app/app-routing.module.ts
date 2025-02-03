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
import { AddProductComponent } from './components/product-management/add-product/add-product.component';
import { AdminUpdateOrderStatusComponent } from './components/admin-update-order-status/admin-update-order-status.component';
import { UserStorageComponent } from './components/user-storage/user-storage.component';
import { ReviewComponent } from './components/review/review.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { CategoryComponent } from './components/category/category.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { RoleGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'favourite', component: FavouriteComponent },
  // { path: 'address', component: AddressComponent },
  { path: 'cart', component: CartComponent, canActivate: [ RoleGuard], data: { role: 'USER' } },
  { path: 'payment', component: PaymentComponent, canActivate: [ RoleGuard], data: { role: 'USER' }},
  { path: 'address/add', component: AddAddressComponent, canActivate: [ RoleGuard], data: { role: 'USER' } },
  { path: 'address/edit', component: EditAddressComponent, canActivate: [ RoleGuard], data: { role: 'USER' } },
  { path: 'admin/management', component: ProductManagementComponent, canActivate: [ RoleGuard], data: { role: 'ADMIN' } },
  { path: 'user', component: UserStorageComponent, canActivate: [ RoleGuard], data: { role: 'USER' } },
  { path: 'superadmin/bank', component: BankComponent, canActivate: [ RoleGuard], data: { role: 'SUPERADMIN' } },
  { path: 'admin/historyPay', component: AdminHistoryComponent, canActivate: [ RoleGuard], data: { role: 'ADMIN' } },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [ RoleGuard], data: { role: 'ADMIN' } },
  { path: 'superadmin/register/admin', component: RegisterAdminComponent, canActivate: [ RoleGuard], data: { role: 'SUPERADMIN' } },
  {
    path: 'superadmin/dashboard',
    component: SuperAdminDashboardComponent, canActivate: [ RoleGuard], data: { role: 'SUPERADMIN' }
  },
  { path: 'admin/add/product', component: AddProductComponent, canActivate: [ RoleGuard], data: { role: 'ADMIN' } },
  { path: 'admin-order', component: AdminUpdateOrderStatusComponent, canActivate: [ RoleGuard], data: { role: 'ADMIN' } },
  // { path: "**", redirectTo: '/home'},
  // { path: 'user/storage', component: UserStorageComponent },
  { path: 'review/:id', component: ReviewComponent, canActivate: [ RoleGuard], data: { role: 'USER' } },
  { path: 'admin/add/category', component: AddCategoryComponent, canActivate: [ RoleGuard], data: { role: 'ADMIN' }  },
  { path: 'admin/show/category', component: CategoryComponent, canActivate: [ RoleGuard], data: { role: 'ADMIN' } },
  { path: 'superadmin/shipping', component: ShippingComponent, canActivate: [ RoleGuard], data: { role: 'SUPERADMIN' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
