import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VideoTelegram } from 'src/app/components/main/service/class-template/video';
import { TelegramAPIService } from 'src/app/service/telegram-api.service';

@Component({
  selector: 'app-mess-video',
  templateUrl: './mess-video.component.html',
  styleUrls: ['./mess-video.component.scss']
})
export class MessVideoComponent implements OnInit {

  @ViewChild('videoRef') videoRef!: ElementRef;;
  @Input() preview: string = '';
  @Input() position: boolean = false;
  @Input() media: any;

  public src: SafeUrl | null = null;

  public percent: number = 0;

  isBut = true;
  isLoaded = false;
  
  constructor(
    private _telegAPIservice: TelegramAPIService,
    private sanitization: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  public loadVideo() {
    this.isBut = false;
    console.log(this.media);
    let video = new VideoTelegram(this._telegAPIservice, this.media.document.size);
    video.loadVideo(this.media.document.id, this.media.document.dc_id, 'mp4', this.media.document.access_hash, this.media.document.file_reference, 0)

    video.updateProgress$.subscribe((data: {percent: number, blob: any}) => {
      console.log(data.percent)
      this.percent = data.percent;
      if (data.blob) {
        this.isLoaded = true;
        reader.onload = (e: any) => {
          this.src = this.sanitization.bypassSecurityTrustUrl(e.target.result);
          console.log(this.videoRef)
          this._play();
        };
        reader.readAsDataURL(data.blob)
      }
    });
    const reader = new FileReader();

  }

  private _play() {
    //this.videoRef.nativeElement.play();
  }

}
