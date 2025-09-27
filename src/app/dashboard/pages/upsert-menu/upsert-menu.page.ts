import { UpsertMenu } from '@/dashboard/components/upsert-menu/upsert-menu';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-upsert-menu.page',
  imports: [UpsertMenu, FluidModule, ButtonModule, RouterLink],
  templateUrl: './upsert-menu.page.html',
  styleUrl: './upsert-menu.page.scss'
})
export default class UpsertMenuPage {

}
