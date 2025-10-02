import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'home-recent-pages',
    imports: [DataViewModule, FormsModule,CommonModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule],
    templateUrl: './recent-pages.html',
    styles: `
        ::ng-deep {
            .p-orderlist-list-container {
                width: 100%;
            }
        }
    `
})
export class RecentPages {}
