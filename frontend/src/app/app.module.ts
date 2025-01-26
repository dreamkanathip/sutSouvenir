import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { AddressComponent } from './components/address/address.component';
import { AddAddressComponent } from './components/address/add-address/add-address.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { EditAddressComponent } from './components/address/edit-address/edit-address.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { UserComponent } from './components/user/user.component';
import { ChangeAddressModalComponent } from './components/address/change-address-modal/change-address-modal.component';
import { UploadReceiptComponent } from './components/payment/upload-receipt/upload-receipt.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BankComponent } from './components/bank/bank.component';
import { AddComponent } from './components/bank/add/add.component';
import { UpdateComponent } from './components/bank/update/update.component';
import { UserStorageComponent } from './components/user-storage/user-storage.component';
import { StorageComponent } from './components/user-storage/storage/storage.component';
import { HistoryComponent } from './components/user-storage/history/history.component';
import { AdminHistoryComponent } from './components/admin-history/admin-history.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';
import { NavbarSuperAdminComponent } from './components/navbar-super-admin/navbar-super-admin.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ReviewComponent } from './components/review/review.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { CategoryComponent } from './components/category/category.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavbarComponent,
    FooterComponent,
    ProductDetailsComponent,
    LoginComponent,
    RegisterComponent,
    FavouriteComponent,
    AddressComponent,
    AddAddressComponent,
    CartComponent,
    PaymentComponent,
    EditAddressComponent,
    ProductManagementComponent,
    UserComponent,
    ChangeAddressModalComponent,
    UploadReceiptComponent,
    BankComponent,
    AddComponent,
    UpdateComponent,
    UserStorageComponent,
    StorageComponent,
    HistoryComponent,
    AdminHistoryComponent,
    AdminDashboardComponent,
    NavbarAdminComponent,
    SuperAdminDashboardComponent,
    NavbarSuperAdminComponent,
    RegisterAdminComponent,
    AddProductComponent,
    ReviewComponent,
    AddCategoryComponent,
    CategoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NoopAnimationsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    NativeDateAdapter,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // เพิ่ม CUSTOM_ELEMENTS_SCHEMA
  bootstrap: [AppComponent],
})
export class AppModule {}
