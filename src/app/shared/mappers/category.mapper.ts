import type { Category } from '../interfaces/category';
import { type MachineEntity, mapMachineEntityToMachine } from './machine.mapper';

export enum CategoryType {
    COIN = 'COIN',
    BILL = 'BILL'
}
export interface CategoryEntity {
    readonly id_category: number;
    readonly title: string;
    readonly type: CategoryType;
    readonly created_at: string;
    readonly updated_at: string;
    readonly machines: MachineEntity[];
}

export const mapCategoryEntityToCategory = (entity: CategoryEntity): Category => {
    return {
        id: entity.id_category,
        title: entity.title,
        createdAt: new Date(entity.created_at),
        updatedAt: new Date(entity.updated_at),
        type: entity.type,
        machines: entity.machines && entity.machines.length > 0 ? entity.machines.map(mapMachineEntityToMachine) : []
    };
};
