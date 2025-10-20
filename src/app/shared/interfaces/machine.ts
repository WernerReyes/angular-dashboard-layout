import type { CategoryType } from "../mappers/category.mapper";
import type { TecnicalSpecifications } from "../mappers/machine.mapper";

export interface Machine {
    readonly id: number;
    readonly description: string | null;
    readonly longDescription: string | null;
    readonly name: string;
    readonly images: string[] | null;
    readonly tecnicalSpecifications: TecnicalSpecifications[] | null;
    readonly categoryId: number;
    readonly categoryTitle: string;
    readonly categoryType: CategoryType;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
