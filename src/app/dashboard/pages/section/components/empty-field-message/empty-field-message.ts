import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'empty-field-message',
  imports: [NgTemplateOutlet],
  templateUrl: './empty-field-message.html',
})
export class EmptyFieldMessage {
  className = input<string>();
  icon = input<string>('pi-info-circle');
  textContent = input<string>();

  @ContentChild('content') contentTemplate?: TemplateRef<any>;
}
