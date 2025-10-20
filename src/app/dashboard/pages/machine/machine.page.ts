import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Table } from './components/table/table';

@Component({
  selector: 'app-machine-page',
  imports: [Table, ButtonModule],
  templateUrl: './machine.page.html',
})
export default class MachinePage {

}
