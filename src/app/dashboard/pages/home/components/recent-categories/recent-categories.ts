import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-recent-categories',
  imports: [DataViewModule, FormsModule, CommonModule, ButtonModule],
  templateUrl: './recent-categories.html',
})
export class RecentCategories {

}
