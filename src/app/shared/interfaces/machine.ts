import type { TecnicalSpecifications } from "../mappers/machine.mapper";
import { Category } from "./category";
import type { Link } from "./link";
import type { Section } from "./section";

export interface Machine {
    readonly id: number;
    readonly description: string | null;
    readonly longDescription: string | null;
    readonly name: string;
    readonly images: string[] | null;
    readonly manual: string | null;
    readonly technicalSpecifications: TecnicalSpecifications[] | null;
    readonly categoryId: number;
    readonly linkId: number | null;
    readonly textButton: string | null;
    readonly link: Link | null;
    readonly category: Category | null;
    readonly sections: Section[] | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
