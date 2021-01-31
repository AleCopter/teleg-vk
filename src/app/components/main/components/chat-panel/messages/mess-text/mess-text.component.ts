import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mess-text',
  templateUrl: './mess-text.component.html',
  styleUrls: ['./mess-text.component.scss']
})
export class MessTextComponent implements OnInit {

  @Input() message: string = '';
  @Input() position: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
