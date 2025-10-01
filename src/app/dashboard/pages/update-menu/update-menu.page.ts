import { UpsertMenu } from '@/dashboard/components/upsert-menu/upsert-menu';
import { MenuFormService } from '@/dashboard/services/menu-form.service';
import { MenuService } from '@/dashboard/services/menu.service';
import { PageService } from '@/dashboard/services/page.service';
import { Component, computed, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { ToastModule } from 'primeng/toast';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { CreateMenu, MenuTypes } from '@/dashboard/interfaces/menu';
import { distinctUntilChanged, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
@Component({
    selector: 'app-upsert-menu.page',
    imports: [JsonPipe, UpsertMenu, FluidModule, ButtonModule, RouterLink, ReactiveFormsModule, ToastModule],
    templateUrl: './update-menu.page.html',
    providers: [MessageService]
})
export default class UpsertMenuPage {
    private readonly messageService = inject(MessageService);
    private readonly menuService = inject(MenuService);
    private readonly pageService = inject(PageService);
    readonly menuFormService = inject(MenuFormService);
    private readonly route = inject(ActivatedRoute);

    private paramMap = toSignal(this.route.paramMap);

   
     private destroy$ = new Subject<void>();
    private lastMenuId: number | null = null;

    // formValue = toSignal(this.menuFormService.form.valueChanges, { initialValue: this.menuFormService.form.value });

    // initialFormValue: any;

    menuId = computed(() => {
        const id = this.paramMap()?.get('id');
        return id ? Number(id) : null;
    });

    errorMessage = this.menuService.errorMessage;

    menuExists = computed(() => !!this.menuService.currentMenu());

    ngOnInit() {
        // Escuchar cambios en el parámetro de ruta
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            map(id => id ? Number(id) : null),
            filter(id => id !== null && id !== this.lastMenuId), // Solo si realmente cambió
            distinctUntilChanged(),
            switchMap(id => {
                this.lastMenuId = id;
                console.log('Fetching menu with ID:', id);
                return this.menuService.getById(id!);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (menu) => {
                if (menu.page) {
                    this.pageService.pageIdsActived.set([menu.page.id]);
                }
                // El populateForm effect se ejecutará automáticamente
            },
            error: (error) => {
                console.error('Error fetching menu:', error);
                this.menuService.errorMessage.set('Error al cargar el menú');
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateMenu() {
        if (this.menuFormService.form.valid && this.menuId()) {
            const menuData = this.menuFormService.form.getRawValue();
            const format: CreateMenu = {
                title: menuData.title,
                order: menuData.order,
                menuType: menuData.menuType as MenuTypes,
                pageId: menuData.pageId,
                active: menuData.active,
                url: menuData.url,
                dropdownArray: menuData.dropdownItems as any
            };
            this.menuService.updateMenu(this.menuId()!, format).subscribe();
        }
    }


    
    
    private populateForm = effect(() => {
         
        if (this.menuExists() && this.menuService.currentMenu()) {
            this.populateFormData();
        }
    });

    private populateFormData() {
        const menu = this.menuService.currentMenu()!;

        console.log('Populating form with menu:', menu, this.menuService.currentMenu()!);
        
        // Poblar datos básicos
        this.menuFormService.form.patchValue({
            title: menu.title,
            order: menu.order,
            menuType: menu.type, // 👈 Usar el tipo real
            pageId: (menu.page?.id ? menu.page.id : null) as any,
            active: menu.active,
            url: menu.url as any
        });

        // Poblar dropdowns si existen
        this.populateDropdownItems(menu);

        // Establecer pageIds
        this.setPageIds(menu);

        // Establecer el tipo seleccionado manualmente
        this.setSelectedMenuType(menu.type);
    }

    private populateDropdownItems(menu: any) {
        if (menu.children && menu.children.length > 1) {
            for (let i = 1; i < menu.children.length; i++) {
                this.menuFormService.addDropdown(menu.children[i].order);
            }
        }

        if (menu.children && menu.children.length >= 1) {
            this.menuFormService.dropdownItems.patchValue(
                menu.children.map((child: any) => ({ 
                    title: child.title, 
                    url: child.url, 
                    order: child.order, 
                    active: child.active, 
                    menuType: child.type, 
                    pageId: (child.page?.id ? child.page.id : null) as any 
                })),
                { emitEvent: false }
            );
        }
    }


    private setPageIds(menu: any) {
        let ids = [];
        if (menu.page) {
            ids.push(menu.page.id);
        }
        if (menu.children) {
            for (const child of menu.children) {
                if (child.page) {
                    ids.push(child.page.id);
                }
            }
        }
        this.pageService.pageIdsActived.set(ids);
    }

    private setSelectedMenuType(menuType: string) {
        const selectedType = this.menuFormService.menusType().find(
            type => type.code === menuType
        );
        if (selectedType) {
            this.menuFormService.selectedMenuType.set(selectedType);
        }
    }

    private showError = effect(() => {
        if (this.errorMessage()) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage()! });
            this.menuService.errorMessage.set(null);
        }
    });

    private showSuccess = effect(() => {
        if (this.menuService.successMessage()) {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: this.menuService.successMessage()! });
            this.menuService.successMessage.set(null);
        }
    });
}


// TODO: Fix the dropdown not being populated when editing a menu with children