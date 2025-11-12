import type { Menu } from '@/shared/interfaces/menu';


export class MenuUtils {
    //*  To Service Methods *//
    static insertMenuItem(list: Menu[], newMenu: Menu): Menu[] {
        if (!newMenu.parentId) {
            // No tiene padre → se agrega al nivel raíz
            return [...list, newMenu];
        }

        const insertRecursively = (menus: Menu[]): Menu[] => {
            return menus.map((menu) => {
                if (menu.id === newMenu.parentId) {
                    // Encontró el padre
                    return {
                        ...menu,
                        children: [...(menu.children || []), newMenu]
                    };
                } else if (menu.children && menu.children.length > 0) {
                    // Buscar en los hijos recursivamente
                    return {
                        ...menu,
                        children: insertRecursively(menu.children)
                    };
                }
                return menu;
            });
        };

        return insertRecursively(list);
    }

    /**
     * Actualiza un ítem dentro de una jerarquía de menús.
     * Si el parentId cambió, mueve el ítem al nuevo padre.
     */
    static updateNestedMenu(list: Menu[], updated: Menu): Menu[] {
        // 1. Verificar si el ítem cambió de padre
        const currentParentId = this.findParentId(list, updated.id);

        if (currentParentId !== updated.parentId) {
            // Remover el ítem de su posición actual
            const listWithoutItem = this.removeMenuFromHierarchy(list, updated.id);

            // Insertar en su nuevo padre (o raíz)
            const updatedItem = structuredClone(updated);
            const newList = this.insertMenuIntoHierarchy(listWithoutItem, updatedItem);

            // Recalcular orden y relaciones
            // this.updateMenuHierarchy(newList);

            return newList;
        }

        // 2. Si el parentId no cambió, solo actualizamos los campos
        return list.map((item) => {
            if (item.id === updated.id) {
                const fieldToUpdate: (keyof Menu)[] = ['title', 'linkId', 'parentId', 'link'];
                for (const field of fieldToUpdate) {
                    if (updated[field] !== undefined) {
                        (item as any)[field] = updated[field];
                    }
                }
                return { ...item };
            }

            if (item.children?.length) {
                const updatedChildren = this.updateChildMenu(item.children, updated);
                return { ...item, children: updatedChildren };
            }

            return item;
        });
    }

    private static updateChildMenu(list: Menu[], updated: Menu): Menu[] {
        return list.map((item) => {
            if (item.id === updated.id) {
                const fieldToUpdate: (keyof Menu)[] = ['title', 'linkId', 'parentId', 'link'];
                for (const field of fieldToUpdate) {
                    if (updated[field] !== undefined) {
                        (item as any)[field] = updated[field];
                    }
                }
                return { ...item };
            }
            if (item.children?.length) {
                return { ...item, children: this.updateChildMenu(item.children, updated) };
            }
            return item;
        });
    }

    /**
     * Busca el parentId actual de un ítem en la jerarquía.
     */
    private static findParentId(list: Menu[], id: number, parentId: number | null = null): number | null {
        for (const item of list) {
            if (item.id === id) return parentId;
            if (item.children?.length) {
                const found = this.findParentId(item.children, id, item.id);
                if (found !== null) return found;
            }
        }
        return null;
    }

    /**
     * Elimina un ítem de toda la jerarquía.
     */
    static removeMenuFromHierarchy(list: Menu[], menuId: number): Menu[] {
        return list
            .filter((item) => item.id !== menuId)
            .map((item) => ({
                ...item,
                children: item.children ? this.removeMenuFromHierarchy(item.children, menuId) : []
            }));
    }

    /**
     * Inserta un ítem dentro de la jerarquía, según su parentId.
     */
    static insertMenuIntoHierarchy(list: Menu[], menuItem: Menu): Menu[] {
        // Si no tiene padre, lo agregamos al nivel raíz
        if (!menuItem.parentId) {
            return [...list, menuItem];
        }

        return list.map((item) => {
            if (item.id === menuItem.parentId) {
                // Insertar directamente bajo este padre
                const newChildren = [...(item.children || []), menuItem];
                return { ...item, children: newChildren };
            }

            // Buscar recursivamente en los hijos
            if (item.children?.length) {
                return { ...item, children: this.insertMenuIntoHierarchy(item.children, menuItem) };
            }

            return item;
        });
    }

    //*  To Component Methods *//
    static updateMenuHierarchy(list: Menu[], parentId: number | null = null) {
        list.forEach((item, index) => {
            // item.order = index + 1;
            item.parentId = parentId ?? null;

            if (item.children && item.children.length > 0) {
                this.updateMenuHierarchy(item.children, item.id);
            }
        });
    }


    static buildReversedTree(menus: Menu[]): Menu[] {
        const map = new Map<number, Menu>();
        const allMenus: Menu[] = [];

        // Función recursiva para aplanar jerarquía de padres
        const flattenWithParents = (menu: Menu) => {
            let current: Menu | null = menu;
            while (current) {
                if (!map.has(current.id)) {
                    map.set(current.id, { ...current, children: [] });
                    allMenus.push(map.get(current.id)!);
                }
                current = current.parent;
            }
        };

        // Aplanar todos los menús con sus padres
        for (const menu of menus) {
            flattenWithParents(menu);
        }

        // Enlazar padres e hijos
        for (const menu of map.values()) {
            if (menu.parentId && map.has(menu.parentId)) {
                map.get(menu.parentId)!.children!.push(menu);
            }
        }

        // Retornar solo las raíces
        return Array.from(map.values()).filter((m) => !m.parentId);
    }
}

