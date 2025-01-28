import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import flatpickr from 'flatpickr';
import Swal from 'sweetalert2';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements AfterViewInit, OnInit {
  startDate: string = '';
  endDate: string = '';
  selectedRange: string = 'allTime';
  startDatePicker: any;
  endDatePicker: any;

  salesByCategory: any;
  title = 'ng2-charts-demo';

  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            family: '"SUT", serif, Arial, sans-serif',
            size: 16,
          },
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          family: '"SUT", serif, Arial, sans-serif',
          size: 16,
        },
        formatter: (value: number, ctx: any) => {
          const total = ctx.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
      },
    },
  };

  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [['เสื้อเลือดหมู'], ['สมุดโน้ต'], 'ปากกา'],
    datasets: [
      {
        data: [428, 326, 224],
      },
    ],
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.defaultDateRange();
    Chart.register(...registerables, ChartDataLabels);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startDatePicker = flatpickr('#startDate', {
        dateFormat: 'Y-n-j',
        altInput: true,
        altFormat: 'j-n-Y',
        onChange: (selectedDates, dateStr) => {
          this.startDate = dateStr;
          this.validateDateRange();
        },
      });
      this.endDatePicker = flatpickr('#endDate', {
        dateFormat: 'Y-n-j',
        altInput: true,
        altFormat: 'j-n-Y',
        onChange: (selectedDates, dateStr) => {
          this.endDate = dateStr;
          this.validateDateRange();
        },
      });
      this.updateDatePickerLimits();
    }
  }

  defaultDateRange() {
    const today = new Date();
    let startDate = new Date();

    switch (this.selectedRange) {
      case 'day':
        startDate.setDate(today.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'annual':
        startDate.setFullYear(today.getFullYear() - 1);
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
          title: 'title-swal',
        },
      });
      customSwal
        .fire({
          title: 'วันที่เริ่มต้นไม่สามารถเลือกหลังจากวันที่สิ้นสุดได้',
          confirmButtonText: 'ยืนยัน',
          icon: 'warning',
          confirmButtonColor: '#d33',
        })
        .then(() => {
          this.endDate = today.toISOString().split('T')[0];
          this.startDate = today.toISOString().split('T')[0];
          this.endDatePicker.setDate(today);
          this.startDatePicker.setDate(today);
        });
    }
  }

    updateDatePickerLimits() {
      this.endDatePicker.set('maxDate', Date.now());
      this.startDatePicker.set('maxDate', Date.now());
    }
}
