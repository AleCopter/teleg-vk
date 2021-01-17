import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent implements OnInit {
  
  public messages = [
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: '123213', out: false},
    {message: 'вцйвйцвйвйцвйцвйцвцй', out: true},
    {message: 'вцйвйцвйвйцвйцвйцвцй', out: true},
    {message: 'вцйвйцвйвйцвйцвйцвцй', out: true},
    {message: 'вцйвйцвйвйцвйцвйцвцй', out: true},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  public scrollUp(event: any): void {}

  public sendMessage(event: any): void {};
}


