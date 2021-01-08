import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { MTProto } from '@mtproto/core';
import { TelegramAPIService } from './service/telegram-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      `message`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`../assets/icon/speech-bubble.svg`),
    );
  }

}
