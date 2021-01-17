import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'time'})
export class TimePipe implements PipeTransform {
  transform(value: number) {
    moment.locale('ru');
    return moment(value * 1000).format('h:mm');
    //return (DATE.getDay() < 10 ? '0' + DATE.getDay() : DATE.getDay()) + '/' + (DATE.getMonth() < 10 ? '0' + DATE.getMonth() : DATE.getMonth()) + '/' + DATE.getFullYear();
  }
}