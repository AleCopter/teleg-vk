import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {

  public status = this.authService.status;
  public auth: {media: number, step: number} = {
    media: -1,
    step: -1,
  }

  public isSend: boolean = false;

  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<UserConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.authService.updateAuth.subscribe(
        (next: any) => {
          this.auth = next;
          this.isSend = false;
          console.log(next.err)
        }
      )
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  public login(_media: number, _step: number): void {
    this.auth.media = _media;
    this.auth.step = _step;
  }

  public telegSendPhone(number: any): void {
    this.isSend = true;
    this.authService.telegGetCode(number);
  }

  public telegLogin(_code: any): void {
    this.isSend = true;
    this.authService.telegLogin(_code);
  } 

  public telegLogout(): void {
    this.isSend = true;
    this.authService.telegLogout();
  } 

  ngOnInit(): void {
  }



}
