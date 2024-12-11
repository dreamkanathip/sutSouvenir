import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { UserStorageComponent } from './components/user-storage/user-storage.component';

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
    UserStorageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [provideClientHydration(), provideHttpClient(withFetch())],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // เพิ่ม CUSTOM_ELEMENTS_SCHEMA
  bootstrap: [AppComponent],
})
export class AppModule {}
