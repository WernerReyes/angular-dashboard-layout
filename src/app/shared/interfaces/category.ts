import { CategoryType } from '../mappers/category.mapper';
import { Machine } from './machine';

export interface Category {
    readonly id: number;
    readonly title: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly type: CategoryType;
    readonly machines: Machine[] | null;
}

type CategoryTypeOption = {
    label: string;
    value: CategoryType;
    severity: string;
    icon: string;
};

export const categoryTypesOptions: Record<CategoryType, CategoryTypeOption> = {
    [CategoryType.COIN]: {
        label: 'Moneda',
        value: CategoryType.COIN,
        severity: 'success',
        icon: 'pi pi-bitcoin'
    },
    [CategoryType.BILL]: {
        label: 'Billete',
        value: CategoryType.BILL,
        severity: 'warning',
        icon: 'pi pi-money-bill'
    }
};
