import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-mess-user-icon',
  templateUrl: './mess-user-icon.component.html',
  styleUrls: ['./mess-user-icon.component.scss']
})
export class MessUserIconComponent implements OnInit {

  @Input() image!: BehaviorSubject<any>;
  public position = 'left';
  
  @Input('position') set setPosition(out: boolean) {
    if(out) {
      this.position = 'right';
    } else {
      this.position = 'left';
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
