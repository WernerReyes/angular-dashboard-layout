import { Injectable, signal } from '@angular/core';

type Message = {
    message: string;
    summary?: string;
}

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    success = signal<Message>({ message: '', summary: 'Éxito' });
    error = signal<Message>({ message: '', summary: 'Error' });

    setSuccess(message: string, summary = 'Éxito') {
        this.success.set({ message, summary });
    }

    setError(message: string, summary = 'Error') {
        this.error.set({ message, summary });
    }

    clearSuccess() {
        this.success.set({ message: '' });
    }

    clearError() {
        this.error.set({ message: '' });
    }
    
}
