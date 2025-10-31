import type { CategoryType } from "../mappers/category.mapper";
import type { TecnicalSpecifications } from "../mappers/machine.mapper";
import { Category } from "./category";

export interface Machine {
    readonly id: number;
    readonly description: string | null;
    readonly longDescription: string | null;
    readonly name: string;
    readonly images: string[] | null;
    readonly manual: string | null;
    readonly technicalSpecifications: TecnicalSpecifications[] | null;
    readonly categoryId: number;
    readonly category: Category | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
