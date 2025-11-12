import { CategoryType } from '../mappers/category.mapper';
import type { Machine } from './machine';
import type { Severity } from './severity';

export interface Category {
    readonly id: number;
    readonly title: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly type: CategoryType;
    readonly machines: Machine[];
}

type CategoryTypeOption = {
    label: string;
    value: CategoryType;
    severity: Severity;
    icon: string;
    color: string;
   searchKeys?: string[];
};

export const categoryTypesOptions: Record<CategoryType, CategoryTypeOption> = {
    [CategoryType.COIN]: {
        label: 'Moneda',
        value: CategoryType.COIN,
        severity: 'warn',
        icon: 'pi pi-bitcoin',
        color: 'gold',
        searchKeys: ['moneda', 'coins', 'dinero pequeño', 'monedas']
    
    },
    [CategoryType.BILL]: {
        label: 'Billete',
        value: CategoryType.BILL,
        severity: 'success',
        icon: 'pi pi-money-bill',
        color: 'green',
        searchKeys: ['billete', 'bills', 'dinero grande', 'billetes']
    }
};
