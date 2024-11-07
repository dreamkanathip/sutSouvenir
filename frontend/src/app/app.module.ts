import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavbarComponent,
    FooterComponent,
    FavouriteComponent,
    ProductDetailsComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
