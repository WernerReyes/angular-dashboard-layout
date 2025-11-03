import type { Menu } from '@/shared/interfaces/menu';
import type { UpdateMenuOrder } from '../interfaces/menu';

interface OrderedItem {
    id: number;
    order: number;
    parentId: number | null;
}

export class MenuUtils {
    //*  To Service Methods *//
    static insertMenuItem(list: Menu[], newMenu: Menu): Menu[] {
    if (!newMenu.parentId) {
        // No tiene padre → se agrega al nivel raíz
        return [...list, newMenu];
    }

    const insertRecursively = (menus: Menu[]): Menu[] => {
        return menus.map(menu => {
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
                const fieldToUpdate: (keyof Menu)[] = ['title', 'linkId', 'active', 'parentId', 'link'];
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
                 const fieldToUpdate: (keyof Menu)[] = ['title', 'linkId', 'active', 'parentId', 'link'];
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

    // /**
    //  * 🔹 Devuelve una lista plana (para enviar al backend)
    //  */
    // static flattenMenu(list: Menu[]) {
    //     // const result: UpdateMenuOrder[] = [];

    //     // const traverse = (items: Menu[]) => {
    //     //     for (const item of items) {
    //     //         result.push({
    //     //             id: item.id,
    //     //             order: item.order!,
    //     //             parentId: item.parentId!
    //     //         });

    //     //         if (item.children?.length) traverse(item.children);
    //     //     }
    //     // };

    //     // traverse(list);
    //     // return result;

        
    // }

    // static orderHierarchically(items: Menu[]): Menu[] {
    //     // Separate parents and children
    //     const parents = items.filter((i) => i.parentId === null);
    //     const children = items.filter((i) => i.parentId !== null);

    //     // Final ordered list
    //     const result: Menu[] = [];

    //     // Loop through each parent and its children
    //     parents.forEach((parent, parentIndex) => {
    //         // Assign order to parent
    //         result.push({
    //             ...parent,
    //             order: parentIndex + 1
    //         });

    //         // Get all children of the current parent
    //         const childrenOfParent = children.filter((c) => c.parentId === parent.id);

    //         // Assign order to each child relative to its parent
    //         childrenOfParent.forEach((child, childIndex) => {
    //             result.push({
    //                 ...child,
    //                 order: childIndex + 1 // local order within the parent
    //             });
    //         });
    //     });

    //     return result;
    // }

    // static orderChildrenOnly(items: Menu[]): Menu[] {
    //     // Group by parentId
    //     const groupedByParent: Record<number, Menu[]> = {};

    //     items.forEach((item) => {
    //         if (item.parentId == null) return; // ignore items without parent
    //         if (!groupedByParent[item.parentId]) groupedByParent[item.parentId] = [];
    //         groupedByParent[item.parentId].push(item);
    //     });

    //     const result: Menu[] = [];

    //     // Assign local order within each parent group
    //     Object.entries(groupedByParent).forEach(([parentId, children]) => {
    //         children.forEach((child, index) => {
    //             result.push({
    //                 ...child,
    //                 order: index + 1 // local order within that parent
    //             });
    //         });
    //     });

    //     return result;
    // }



   static buildReversedTree(menus: Menu[]): Menu[] {
    const result: Menu[] = [];

    for (const menu of menus) {
        // Buscamos el ancestro más alto
        let current = menu;
        const chain: Menu[] = [];

        // Subimos hasta el ancestro
        while (current) {
            chain.unshift({
                ...current,
                children: []
            });
            current = current.parent as Menu;
        }

        // Ahora conectamos de abuelo a nieto
        for (let i = 0; i < chain.length - 1; i++) {
            chain[i].children!.push(chain[i + 1]);
        }

        // El primero de la cadena (abuelo) es la raíz
        result.push(chain[0]);
    }

    return result;
}

}
