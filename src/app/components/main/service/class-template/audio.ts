import { BehaviorSubject } from "rxjs";
import { TelegramAPIService } from "src/app/service/telegram-api.service";



export class AudioTelegram {
    public updateProgress$: BehaviorSubject<any>;

    private _percent = 0;
    private _bytes!: Int8Array;

    constructor(
        private _telegAPIService: TelegramAPIService,
        private _size: number
    ) {
        this.updateProgress$ = new BehaviorSubject({ percent: this._percent });
    }

    public loadVideo(id: number, dcId: number, thumbType: string, accessHash: string, fileReference: any, offset: number) {
        this._telegAPIService.getMediaVideo(id, dcId, thumbType, accessHash, fileReference, offset).then((result: any) => {

            if (this._bytes) {
                let bytes = new Int8Array(this._bytes.length + result.bytes.length);
                bytes.set(this._bytes);
                bytes.set(result.bytes, this._bytes.length);
                this._bytes = bytes;
            } else {
                this._bytes = result.bytes;
            }

            if (result.bytes.length === 1048576) {
                offset += 1048576;
                this._updatePercent(offset);
                this.loadVideo(id, dcId, thumbType, accessHash, fileReference, offset);
            } else {
                offset += result.bytes.length;
                this._updatePercent(offset, new Blob([this._bytes], { type: 'audio/mp3' }));
            }
        })
    }

    private _updatePercent(offset: number, blob?: any) {
        this._percent = offset * 100 / this._size;
        this.updateProgress$.next({percent: this._percent, blob: blob});
    }

}