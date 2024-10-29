import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FavouriteComponent } from './components/favourite/favourite.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'fav', component: FavouriteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
