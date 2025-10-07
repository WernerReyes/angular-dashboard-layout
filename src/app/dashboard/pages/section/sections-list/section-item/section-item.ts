import { Component, inject, input, output } from '@angular/core';
import type { SectionItem as ISectionItem } from '@/shared/interfaces/section-item';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ImageError } from '@/shared/components/error/image/image';
import { SectionItemService } from '@/dashboard/services/section-item.service';
import { ConfirmationService, MenuItem, MenuItemCommandEvent } from 'primeng/api';

@Component({
    selector: 'section-item',
    imports: [ImageError, CardModule, ButtonModule, MenuModule],
    templateUrl: './section-item.html'
})
export class SectionItem {
    private readonly sectionItemService = inject(SectionItemService);
    private readonly confirmationService = inject(ConfirmationService);
    sectionItem = input.required<ISectionItem>();
    onSelectSectionItem = output<void>();

    menu = null;

    items: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',

            command: () => {
                this.onSelectSectionItem.emit();
            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: (event: MenuItemCommandEvent) => {
                this.deleteSectionItem(event.originalEvent!);
            }
        }
    ];

    deleteSectionItem(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Estás seguro de que deseas eliminar este elemento de la sección?',
            header: 'Confirmación',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Eliminar'
            },
            accept: () => {
                if (this.sectionItem()) {
                    this.sectionItemService.delete(this.sectionItem().id!, this.sectionItem().sectionId!).subscribe();
                }
            }
        });
    }
}
