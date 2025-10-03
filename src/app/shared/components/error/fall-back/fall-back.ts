import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-fall-back',
    imports: [ButtonModule],
    templateUrl: './fall-back.html'
})
export class FallBack {
    retry = output<void>();
    loading = input<boolean>(false);
    message = input<string | undefined>('Ha ocurrido un error inesperado.');

}
