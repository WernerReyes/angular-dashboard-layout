import { MenuService } from '@/dashboard/services/menu.service';
import { MenuUtils } from '@/dashboard/utils/menu.utils';
import { Menu } from '@/shared/interfaces/menu';
import { Component, effect, inject, linkedSignal, model } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
type MenuComponent = Menu & {
    expanded?: boolean;
};

@Component({
    selector: 'confirm-order-changes',
    imports: [ConfirmDialogModule],
    template: `<p-confirmdialog key="positionDialog" [position]="'bottom'" />`,
    providers: [ConfirmationService]
})
export class ConfirmOrderChanges {
    private readonly confirmationService = inject(ConfirmationService);
    private readonly menuService = inject(MenuService);

    filteredMenuList = model.required<MenuComponent[]>();
    hasChanges = model(false);
    lastChangeTime = model<number | null>(null);

    menuList = this.menuService.menuListResource;


    originMenuList = linkedSignal<MenuComponent[]>(() => {
        return (this.menuList.value() || []).map((menu) => ({ ...menu, expanded: false })) as MenuComponent[];
    });

    private debounceTimer: any;

    /**
     * Ejemplo de uso: obtener IDs y orden después del drag-drop
     */
    saveMenuOrder() {
        const flattened = MenuUtils.flattenMenu(this.filteredMenuList()) ?? [];
        this.menuService.updateOrder(flattened).subscribe({
            next: () => {
                this.hasChanges.set(false);
            },
            error: () => {
                this.filteredMenuList.set(this.originMenuList());
                this.hasChanges.set(false);
            }
        });
    }
    // Enviar al backend:

    private showAlertEffect = effect(() => {
        if (!this.hasChanges()) return;

        // limpiar temporizador previo si hay otro drop rápido
        clearTimeout(this.debounceTimer);

        // iniciar un nuevo temporizador de 2 segundos (puedes ajustar)
        this.debounceTimer = setTimeout(() => {
            // verificamos si sigue habiendo cambios
            if (this.hasChanges()) {
                this.askToSaveChanges();
            }
        }, 2000);
    });

    askToSaveChanges() {
        this.confirmationService.confirm({
            message: 'Se han realizado cambios en el orden del menú. ¿Desea guardar los cambios?',
            header: 'Guardar cambios',
            icon: 'pi pi-info-circle',
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                text: true
            },
            acceptButtonProps: {
                label: 'Guardar',
                text: true
            },
          closable: false,
            accept: () => {
                this.saveMenuOrder();
            },
            reject: () => {
                this.filteredMenuList.set(this.originMenuList());
                this.hasChanges.set(false);
            },
            key: 'positionDialog'
        });
    }

}
