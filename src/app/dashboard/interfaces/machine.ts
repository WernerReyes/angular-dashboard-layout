import type { TecnicalSpecifications } from '@/shared/mappers/machine.mapper';

export interface CreateMachine {
    readonly name: string;
    readonly shortDescription: string;
    readonly fullDescription: string;
    readonly fileImages: File[];
    readonly manualFile?: File | null;
    readonly technicalSpecifications: TecnicalSpecifications[];
    readonly categoryId: number;
    readonly linkId?: number | null;
    readonly textButton: string | null;
}

export interface UpdateMachine extends Partial<CreateMachine> {
    readonly imagesToUpdate?: { id: string; oldImage: string; newFile: File }[];
    readonly imagesToRemove?: string[];
    readonly id: number;
}
