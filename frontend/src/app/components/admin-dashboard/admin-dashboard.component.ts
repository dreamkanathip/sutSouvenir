import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import flatpickr from 'flatpickr';
import { Chart } from 'chart.js';
import { start } from 'repl';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements AfterViewInit, OnInit{
  startDate: string = '';
  endDate: string = '';
  selectedRange: string = 'day';
  startDatePicker: any;
  endDatePicker: any;

  salesByCategory: any

  data = {
    labels: ['Red', 'Yellow', 'Blue'], // ชื่อของแต่ละส่วนในกราฟ
    datasets: [{
      data: [10, 20, 30], // ข้อมูลของแต่ละส่วน
      backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'], // สีของแต่ละส่วน
      borderColor: ['#FF6384', '#FFCE56', '#36A2EB'], // สีของเส้นขอบ
      borderWidth: 1 
    }]
  };

  constructor( @Inject(PLATFORM_ID) private platformId: Object ) {
    this.defaultDateRange()
  }

  ngOnInit() {
  
    this.salesByCategory = new Chart('salesByCategory', {
      type: 'doughnut', // ประเภทของกราฟ
      data: this.data, // ข้อมูลของกราฟ
      options: { // ตัวเลือกเพิ่มเติม (ถ้ามี)
        responsive: true, // ทำให้กราฟปรับขนาดตามหน้าจอ
        maintainAspectRatio: false // ไม่คงสัดส่วนของกราฟ
      }
    });
  }

  ngAfterViewInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.startDatePicker = flatpickr('#startDate', {
          dateFormat: 'Y-n-j',
          altInput: true,
          altFormat: "j-n-Y",
          onChange: (selectedDates, dateStr) => {
            this.startDate = dateStr;
            this.validateDateRange()
          },
        });
        this.endDatePicker = flatpickr('#endDate', {
          dateFormat: 'Y-n-j',
          altInput: true,
          altFormat: "j-n-Y",
          onChange: (selectedDates, dateStr) => {
            this.endDate = dateStr;
            this.validateDateRange()
          },
        });
        this.updateDatePickerLimits();
      }
    }

    defaultDateRange() {
      const today = new Date();
      let startDate = new Date();

      switch(this.selectedRange) {
        case 'day':
          startDate.setDate(today.getDate()-1);
          break;
        case 'week':
          startDate.setDate(today.getDate()-7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth()-1);
          break;
        case 'annual':
          startDate.setFullYear(today.getFullYear()-1);
          break;
      }
      this.startDate = startDate.toISOString().split('T')[0];
      this.endDate = today.toISOString().split('T')[0];

      if (this.startDatePicker && this.endDatePicker) {
        this.startDatePicker.setDate(this.startDate);
        this.endDatePicker.setDate(this.endDate);
      }
    }

    onRangeChange() {
      this.defaultDateRange();
    }

    validateDateRange() {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      const today = new Date();
    
      if (startDate > endDate) {
        const customSwal = Swal.mixin({
          customClass: {
            title: "title-swal",
          },
        });
        customSwal.fire({
          title: "วันที่เริ่มต้นไม่สามารถเลือกหลังจากวันที่สิ้นสุดได้",
          confirmButtonText: "ยืนยัน",
          icon: "warning",
          confirmButtonColor: "#d33",
        }).then(() => {
          this.endDate = today.toISOString().split('T')[0]
          this.startDate = today.toISOString().split('T')[0]
          this.endDatePicker.setDate(today)
          this.startDatePicker.setDate(today)
        });
      }
    }

    updateDatePickerLimits() {
      this.endDatePicker.set('maxDate', Date.now());
    }
}
