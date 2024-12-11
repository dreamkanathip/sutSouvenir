import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import flatpickr from 'flatpickr';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-upload-receipt',
  templateUrl: './upload-receipt.component.html',
  styleUrls: ['./upload-receipt.component.css'],
})
export class UploadReceiptComponent implements AfterViewInit {
  @Input() sumItemPrice!: number
  imagePreview: string | ArrayBuffer | null = "/assets/placeholder.jpg";
  hrArray: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minArray: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  date!: string;
  hr: string = '00';
  min: string = '00';
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      flatpickr('#date', {
        dateFormat: 'j-n-Y',
        altInput: true,
        altFormat: "j-n-Y",
        onChange: (selectedDates, dateStr) => {
          this.date = dateStr;
          console.log('Selected date and time:', this.date);
        },
      });
    }
  }
}
