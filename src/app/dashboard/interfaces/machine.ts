import type { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';

export interface CreateMachine {
    readonly name: string;
    readonly shortDescription: string;
    readonly fullDescription: string;
    readonly fileImages: File[];
    readonly manualFile?: File | null;
    readonly technicalSpecifications: TecnicalSpecifications[];
    readonly categoryId: number;
}
