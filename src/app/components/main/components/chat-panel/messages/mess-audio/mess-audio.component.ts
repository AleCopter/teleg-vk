import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioTelegram } from 'src/app/components/main/service/class-template/audio';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

@Component({
  selector: 'app-mess-audio',
  templateUrl: './mess-audio.component.html',
  styleUrls: ['./mess-audio.component.scss']
})
export class MessAudioComponent implements OnInit {
  @ViewChild('audioRef') audioRef!: ElementRef;
  @Input() media!: any;
  public src: any = '';

  constructor(
    private _telegAPIservice: TelegramAPIService,
    private sanitization: DomSanitizer,
  ) {

  }

  ngOnInit(): void {

  }


  public loadAudio() {
    console.log(this.media);

    let audio = new AudioTelegram(this._telegAPIservice, this.media.document.size);
    audio.loadVideo(this.media.document.id, this.media.document.dc_id, 'mp4', this.media.document.access_hash, this.media.document.file_reference, 0)

    audio.updateProgress$.subscribe((data: {percent: number, blob: any}) => {
      console.log(data.percent)
      //this.percent = data.percent;
      if (data.blob) {
        //this.isLoaded = true;
        reader.onload = (e: any) => {
          this.src = this.sanitization.bypassSecurityTrustUrl(e.target.result);
        };
        reader.readAsDataURL(data.blob)
      }
    });
    const reader = new FileReader();
  }

}
