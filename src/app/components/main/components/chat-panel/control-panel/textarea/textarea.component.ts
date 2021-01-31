import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  
  public sendMessage(event: any): void { 
    console.log(event);
  };

}
