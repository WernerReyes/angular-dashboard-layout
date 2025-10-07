import { SectionItem } from '@/shared/interfaces/section-item';
import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'section-hero-item',
    imports: [CarouselModule, ButtonModule, TagModule, MenuModule],
    templateUrl: './section-hero-item.html',
    styleUrl: './section-hero-item.scss'
})
export class SectionHeroItem {
    sectionItems = input.required<SectionItem[]>();

    responsiveOptions: any[] | undefined;

    selectedItem = linkedSignal<SectionItem | null>(() => {
        return this.sectionItems().length > 0 ? this.sectionItems()[0] : null;
    });

    onSelectSectionItem = output<SectionItem>();

     
    onPageChange(event: any) {
        this.selectedItem.set(this.sectionItems()[event.page]);
    }

    private effect = effect(() => {
       console.log({ selected: this.selectedItem() })
    });


     items: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-fw pi-pencil',

            command: () => {
                // this.onSelectSectionItem.emit();

                this.onSelectSectionItem.emit(this.selectedItem()!);

            }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-fw pi-trash',
            command: (event: MenuItemCommandEvent) => {
                // this.deleteSectionItem(event.originalEvent!);
            }
        }
    ];
    
}
