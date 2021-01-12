import { ChangeDetectorRef, Component, Input, OnInit, Output } from '@angular/core';
import { DialogService } from '../../../service/dialog.service';

@Component({
  selector: 'app-dialog-row',
  templateUrl: './dialog-row.component.html',
  styleUrls: ['./dialog-row.component.scss']
})
export class DialogRowComponent implements OnInit {

  @Input() d: any;
  @Input() index: number = -1;

  constructor(
    private _dialogService: DialogService,
    private _changeDetection: ChangeDetectorRef,
  ) {

    this._dialogService.updateStatus.subscribe(
      (data: {id: number, source: string, online: boolean}) => {
        if(data.source !== 'none' && this.d.user) {
          if (data.id === this.d.user.id && data.source === this.d.source) {
            this.d.user.online = data.online;
            console.log(data.online)
            this._changeDetection.detectChanges();
          }
        }
      }
    )

    this._dialogService.updateMessage.subscribe(
      (data: {id: number, source: string, message: string, date: number}) => {
        if(data.source !== 'none' && this.d.user) {
          if (data.id === this.d.user.id && data.source === this.d.source) {
            this.d.message = data.message;
            this.d.date = data.date;
            this._dialogService.swapDialog(this.index);
            this._changeDetection.detectChanges();
          }
        }
 
      }
    )
  }

  ngOnInit(): void {
    console.log(this.d);
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

  public getSource(name: string): string {
    //console.log(name)
    let color: string = 'white';
    switch(name) {
      case 'vk': {
        color = 'linear-gradient(90deg, #2196F3 30%, transparent 100%)';
        break;
      }
      case 'telegram': {
        color = 'linear-gradient(90deg, #673AB7 30%, transparent 100%)'
        break;
      }
    }
    return color;
  }

}
