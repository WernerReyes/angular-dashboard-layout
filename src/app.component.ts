import { MessageService } from '@/shared/services/message.service';
import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService as MessageServicePrime } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: ` <p-toast />
        <router-outlet></router-outlet>`,
    providers: [MessageServicePrime]
})
export class AppComponent {
    private readonly messageServicePrime = inject(MessageServicePrime);
    private readonly messageService = inject(MessageService);
    
    private showSuccess = effect(() => {
        const { message, summary } = this.messageService.success();
        if (message) {
            this.messageServicePrime.add({ severity: 'success', summary, detail: message, life: 3000 });
            this.messageService.clearSuccess();
        }
    });

    private showError = effect(() => {
        const { message, summary } = this.messageService.error();
        if (message) {
            this.messageServicePrime.add({ severity: 'error', summary, detail: message, life: 3000 });
            this.messageService.clearError();
        }
    });
}
