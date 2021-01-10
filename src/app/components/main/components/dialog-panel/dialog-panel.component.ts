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

  public getNameIcon(data: any): string {
    let name;
    if (data.split(" ")[1] !== undefined) {
      name = data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[1].charAt(0).toUpperCase()
    } else if (data.split(" ")[0].charAt(1) !== undefined) {
      name = data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[0].charAt(1).toUpperCase()
    } else {
      name = data.split(' ')[0].charAt(0).toUpperCase();
    }
    return name
  }

  public getColorIcon(data: string): string {
    var colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
      "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
    let initials;
    if (data.split(" ")[1] !== undefined) {
      initials = data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[1].charAt(0).toUpperCase()
    } else if (data.split(" ")[0].charAt(1) !== undefined) {
      initials = data.split(' ')[0].charAt(0).toUpperCase() + data.split(' ')[0].charAt(1).toUpperCase()
    } else {
      initials = data.split(' ')[0].charAt(0).toUpperCase();
    }

    let charIndex = initials.charCodeAt(0) - 65;
    let colorIndex = charIndex % 19;
    return colors[colorIndex];

  }
}
