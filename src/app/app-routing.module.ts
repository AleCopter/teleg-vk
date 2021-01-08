import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { TelegTestComponent } from './components/teleg-test/teleg-test.component';
import { VkTestComponent } from './components/vk-test/vk-test.component';

const routes: Routes = [


  { path: 'vk', component: VkTestComponent },
  { path: 'teleg', component: TelegTestComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
