import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateToThai'
})
export class FormatDateToThaiPipe implements PipeTransform {

  transform(date: Date | string | null): string {
    if(!date) return '';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }
    return new Intl.DateTimeFormat('th-TH', options).format(new Date(date))
  }

}
