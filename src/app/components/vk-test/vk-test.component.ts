import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

@Component({
  selector: 'app-vk-test',
  templateUrl: './vk-test.component.html',
  styleUrls: ['./vk-test.component.scss']
})
export class VkTestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
