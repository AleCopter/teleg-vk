import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'dateMessage'})
export class DateMessagePipe implements PipeTransform {
  transform(value: number) {
    moment.locale('ru');
    const DATE = moment(value * 1000).calendar();
    return DATE
    //return (DATE.getDay() < 10 ? '0' + DATE.getDay() : DATE.getDay()) + '/' + (DATE.getMonth() < 10 ? '0' + DATE.getMonth() : DATE.getMonth()) + '/' + DATE.getFullYear();
  }
}