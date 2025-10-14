import { AuthService } from '@/auth/services/auth.service';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { InitialsPipe } from '@/pipes/initials-pipe';

@Component({
    selector: 'profile',
    imports: [InitialsPipe, MenuModule, AvatarModule],
    templateUrl: './profile.html',
    
})
export class Profile {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    showMenu = signal(false);

    user = this.authService.user;

    fullName = computed(() => {
        return this.user() ? `${this.user()!.name} ${this.user()!.lastname}` : '';
    })

    items: MenuItem[] = [
        {
            label: 'Opciones',
            items: [
                {
                    label: 'Cerrar sesión',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        this.authService.logout().subscribe({
                            next: () => {
                                this.router.navigateByUrl('/auth/login');
                            }
                        });
                    }
                },
                {
                    label: 'Configuración',
                    icon: 'pi pi-cog',
                    command: () => {
                        this.router.navigateByUrl('/dashboard/settings');
                    }
                }
            ]
        }
    ];
}
