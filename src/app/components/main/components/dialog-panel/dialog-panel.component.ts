import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-dialog-panel',
  templateUrl: './dialog-panel.component.html',
  styleUrls: ['./dialog-panel.component.scss']
})
export class DialogPanelComponent implements OnInit {

  constructor(
    public dialogService: DialogService,
  ) { 
    
  }

  ngOnInit(): void {
  }


  public selectDialog(d: any): void {

  }
}
