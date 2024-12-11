import { Component } from '@angular/core';
import { DestBank } from '../../interfaces/bank/dest-bank';
import { OriginBank } from '../../interfaces/bank/origin-bank';
import { BankService } from '../../services/bank/bank.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.css'
})
export class BankComponent {
  destBank!: DestBank[];
  originBank!: OriginBank[];
  isDestBank!: boolean;

  constructor(private bankService: BankService) {
    this.getBank()
  }

  getBank() {
    this.bankService.getDestBank().subscribe(res => {
      this.destBank = res
    })
    this.bankService.getOriginBank().subscribe(res => {
      this.originBank = res
    })
  }
  openDestBank() {
    this.isDestBank = true
  }
  openOriginBank() {
    this.isDestBank = false
  }
}
