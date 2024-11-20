import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FavouriteComponent } from './components/favourite/favourite.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // หน้าแรก redirect ไป login
  { path: 'login', component: LoginComponent }, // หน้า login
  { path: 'home', component: HomepageComponent }, // หน้า home
  { path: 'favourite', component: FavouriteComponent }, // หน้า favourite
  { path: 'register', component: RegisterComponent }, // หน้า register
  { path: '**', redirectTo: 'login' }, // ถ้า path ไม่ถูกต้อง redirect ไป login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
