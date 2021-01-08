import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './core/toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { TelegramAPIService } from './service/telegram-api.service';
import { TelegTestComponent } from './components/teleg-test/teleg-test.component';
import { VkTestComponent } from './components/vk-test/vk-test.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    TelegTestComponent,
    VkTestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [TelegramAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
