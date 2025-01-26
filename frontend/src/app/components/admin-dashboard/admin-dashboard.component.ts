import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import flatpickr from 'flatpickr';
import Swal from 'sweetalert2';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
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
  title = 'ng2-charts-demo';

  // Pie
  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
  };
  public pieChartLabels = [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ];
  public pieChartDatasets = [ {
    data: [ 300, 500, 100 ]
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0,
        borderColor: 'black',
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;
  
  constructor( @Inject(PLATFORM_ID) private platformId: Object ) {
    this.defaultDateRange()
    Chart.register(...registerables);
  }

  ngOnInit() {
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
