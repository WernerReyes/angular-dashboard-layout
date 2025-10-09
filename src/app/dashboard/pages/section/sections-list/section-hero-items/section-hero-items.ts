import { SectionItemService } from '@/dashboard/services/section-item.service';
import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { ConfirmationService, MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { HeroItem } from './hero-item/hero-item';

@Component({
    selector: 'section-hero-items',
    imports: [HeroItem, CarouselModule, ButtonModule, TagModule, MenuModule],
    templateUrl: './section-hero-items.html',
    styleUrl: './section-hero-items.scss'
})
export class SectionHeroItems {
    private readonly sectionItemService = inject(SectionItemService);
    private readonly confirmationService = inject(ConfirmationService);
    sectionItems = input.required<SectionItem[]>();

    selectedItem = signal<SectionItem | null>(null);

    onSelectSectionItem = output<SectionItem>();

    onPageChange(event: any) {
        this.selectedItem.set(this.sectionItems()[event.page]);
    }

    private initSelectedItem = effect(() => {
        const items = this.sectionItems();

        if (this.selectedItem() === null && items.length > 0) {
            this.selectedItem.set(items[0]);
        } else if (this.selectedItem() && items.length > 0) {
            const currentItem = items.find((item) => item.id === this.selectedItem()?.id) || null;
            this.selectedItem.set(currentItem);
        }
    });

    items: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',

            command: () => {
                console.log('emitiendo item:', this.selectedItem());
                this.onSelectSectionItem.emit(this.selectedItem()!);
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
                if (this.selectedItem()) {
                    this.sectionItemService.delete(this.selectedItem()!.id, this.selectedItem()!.sectionId).subscribe();
                    this.selectedItem.set(null);
                }
            }
        });
    }
}
