import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Table } from './components/table/table';
import { CategoryDialogForm } from "./components/category-dialog-form/category-dialog-form";

@Component({
  selector: 'app-machine-page',
  imports: [Table, ButtonModule, CategoryDialogForm],
  templateUrl: './machine.page.html',
})
export default class MachinePage {
displayDialog = signal<boolean>(false);
}
