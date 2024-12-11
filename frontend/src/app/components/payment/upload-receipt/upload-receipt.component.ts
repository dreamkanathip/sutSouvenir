import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import flatpickr from 'flatpickr';
import { Inject, PLATFORM_ID } from '@angular/core';
import { BankService } from '../../../services/bank/bank.service';
import { DestBank } from '../../../interfaces/bank/dest-bank';
import { OriginBank } from '../../../interfaces/bank/origin-bank';

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
  destBank!: DestBank[];
  originBank!: OriginBank[];
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private bankService: BankService) {
    this.getBank()
  }

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

  getBank() {
    this.bankService.getDestBank().subscribe(res => {
      this.destBank = res
    })
    this.bankService.getOriginBank().subscribe(res => {
      this.originBank = res
    })
  }
}
