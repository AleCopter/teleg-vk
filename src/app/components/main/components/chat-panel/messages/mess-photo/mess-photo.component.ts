import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mess-photo',
  templateUrl: './mess-photo.component.html',
  styleUrls: ['./mess-photo.component.scss']
})
export class MessPhotoComponent implements OnInit {
  
  @Input() image: string = '';
  @Input() position: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
