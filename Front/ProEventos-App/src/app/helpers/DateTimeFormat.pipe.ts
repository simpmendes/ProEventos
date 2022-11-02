import { Constants } from './../util/Constants';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value = value?.replaceAll('/', '-');
    value = value?.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3');
    return super.transform(value, Constants.DATE_TIME_FMT);
  }

}
