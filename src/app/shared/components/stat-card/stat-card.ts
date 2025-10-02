import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() description!: string;
  @Input() iconBackground?: string;
  @Input() iconColor?: string;
  @Input() colSpan?: string = 'col-span-12 lg:col-span-6 xl:col-span-3';

  get iconBackgroundClass(): string {
    return this.iconBackground || 'bg-blue-100 dark:bg-blue-400/10';
  }

  get iconColorClass(): string {
    return this.iconColor || 'text-blue-500';
  }
}