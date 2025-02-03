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
import { OrderService } from '../../services/order/order.service';
import { HomepageService } from '../../services/homepage/homepage.service';
import { Order } from '../../interfaces/order/order';
import { Product } from '../../interfaces/products/products.model';

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

  products: Product[] = [];
  emptyProduct: Product[] = []
  lowProduct: Product[] = []

  productQuantityWarning: number = 10


  allOrders: Order[] = [];
  orderCount: { productId: number, title: string, count: number, price: number }[] = [];
  orderTotal: number = 0;
  orderStatusCounts: { PENDING: number, NOT_PROCESSED: number, PROCESSED: number } = { PENDING: 0, NOT_PROCESSED: 0, PROCESSED: 0 };

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object, 
    private orderService: OrderService,
    private homepageService: HomepageService,
  ) {
    this.defaultDateRange();
    Chart.register(...registerables, ChartDataLabels);
    this.getOrders();
    this.getProducts();
  }

  ngOnInit() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Add one day to the current date
    this.endDate = tomorrow.toISOString().split('T')[0]; // Set endDate to one day after the current date

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
      defaultDate: tomorrow, // Set default date to current date
      onChange: (selectedDates, dateStr) => {
        this.endDate = dateStr;
        this.validateDateRange();
      },
    });

    this.updateDatePickerLimits();
    this.getOrders();
    this.getProducts();
  }

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

  getOrders() {
    this.orderService.getOrders().subscribe((orders) => {
      this.allOrders = orders.filter(order => order.orderStatus !== 'CANCELLED');
      this.calculateSales();
      this.countProductOrders();
      this.orderStatusCounts = this.countOrdersByStatus();
    });
  }

  getProducts() {
    this.homepageService.getAllProducts().subscribe((products) => {
      this.products = products.map(product => ({ ...product, orderCount: 0 }));
      this.emptyProduct = products.filter(product => product.quantity == 0);
      this.lowProduct = products.filter(product => product.quantity <= this.productQuantityWarning && product.quantity != 0)
      this.countProductOrders();
    });
  }

  calculateSales() {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    this.orderTotal = 0;

    const PaidOrder = this.allOrders.filter((order) => order.orderStatus !== "NOT_PROCESSED" && order.orderStatus !== "PENDING");
    // console.log("Paid:", PaidOrder)

    // console.log("Start:", startDate)
    // console.log("End:", endDate)
  
    PaidOrder.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      // console.log("Now:", orderDate)
      if (orderDate >= startDate && orderDate <= endDate) {
        this.orderTotal += order.cartTotal;
      }
    });
  }

  countOrdersByStatus() {
    const statusCounts = {
      PENDING: 0,
      NOT_PROCESSED: 0,
      PROCESSED: 0,
    };
  
    this.allOrders.forEach((order) => {
      if (order.orderStatus === 'PENDING') {
        statusCounts.PENDING++;
      } else if (order.orderStatus === 'NOT_PROCESSED') {
        statusCounts.NOT_PROCESSED++;
      } else if (order.orderStatus === 'PROCESSED') {
        statusCounts.PROCESSED++;
      }
    });
  
    return statusCounts;
  }

  countProductOrders() {
    const productOrderCounts: { [key: number]: number } = {};
  
    this.allOrders.forEach((order) => {
      order.products.forEach((product) => {
        if (productOrderCounts[product.productId]) {
          productOrderCounts[product.productId] += product.count;
        } else {
          productOrderCounts[product.productId] = product.count;
        }
      });
    });
  
    this.orderCount = Object.entries(productOrderCounts).map(([productId, count]: [string, number]) => ({
        productId: Number(productId),
        title: this.products.find((product) => product.id === Number(productId))?.title || '',
        count,
        price: this.products.find((product) => product.id === Number(productId))?.price || 0,
      })
    );

    this.sortProductsByOrderCount();
  }

  sortProductsByOrderCount() {
    this.orderCount.sort((a, b) => b.count - a.count);
    this.calculateChartData();
  }

  defaultDateRange() {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date()

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
    if (endDate.getTime() === today.getTime()) {
      endDate.setDate(today.getDate() + 1);
      this.endDate = endDate.toISOString().split('T')[0];
    } else {
      this.endDate = today.toISOString().split('T')[0];
    }

    if (this.startDatePicker && this.endDatePicker) {
      this.startDatePicker.setDate(this.startDate);
      this.endDatePicker.setDate(this.endDate);
    }
    this.calculateSales();
  }

  calculateChartData() {
    const chartData: ChartData<'doughnut', number[], string | string[]> = {
      labels: this.orderCount.slice(0, 3).map((product) => product.title),
      datasets: [{
        data: this.orderCount.slice(0, 3).map((product) => product.count)
      }],
    };
    this.pieChartData = chartData;
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
          confirmButton: "text-swal",
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
