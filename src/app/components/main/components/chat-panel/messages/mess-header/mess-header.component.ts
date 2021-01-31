import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mess-header',
  templateUrl: './mess-header.component.html',
  styleUrls: ['./mess-header.component.scss']
})
export class MessHeaderComponent implements OnInit {

  @Input() name: string = '';
  @Input() date: any;
  @Input() position: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
