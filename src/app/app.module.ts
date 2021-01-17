import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './core/toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { TelegramAPIService } from './service/telegram-api.service';
import { TelegTestComponent } from './components/teleg-test/teleg-test.component';
import { VkTestComponent } from './components/vk-test/vk-test.component';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { DateMessagePipe } from './pipes/date-message.pipe';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { UserConfigComponent } from './core/user-config/user-config.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AuthService } from './service/auth.service';
import { VkAPIService } from './service/vk-api.service';
import { DialogService } from './components/main/service/dialog.service';
import { MainComponent } from './components/main/main.component';
import { DialogPanelComponent } from './components/main/components/dialog-panel/dialog-panel.component';
import { DialogRowComponent } from './components/main/components/dialog-panel/dialog-row/dialog-row.component';
import { SafePipe } from './pipes/safe.pipe';
import { ChatPanelComponent } from './components/main/components/chat-panel/chat-panel.component';
import { ChatService } from './components/main/service/chat.service';
import { TimePipe } from './pipes/time.pipe';

registerLocaleData(localeRu);

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    TelegTestComponent,
    VkTestComponent,

    DateMessagePipe,
    SafePipe,
    TimePipe,

    UserConfigComponent,
    MainComponent,
    DialogPanelComponent,
    DialogRowComponent,
    ChatPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatIconModule,
    MatDialogModule,
    PerfectScrollbarModule,

    BrowserAnimationsModule,
  ],
  providers: [TelegramAPIService, VkAPIService, DialogService, ChatService, AuthService, 
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: LOCALE_ID, useValue: 'ru' 
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
