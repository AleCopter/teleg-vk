import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserConfigComponent } from '../user-config/user-config.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.openConfig();
  }

  
  public openConfig(): void {
    const dialogRef = this.dialog.open(UserConfigComponent, {
      width: '600px',
      //height: '400px',
      data: {},
      panelClass: 'user-config'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
