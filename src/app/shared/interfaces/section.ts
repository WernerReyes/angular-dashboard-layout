import { SectionType } from '../mappers/section.mapper';
import { SectionItem } from './section-item';

export interface Section {
    id: number;
    orderNum: number;
    type: SectionType;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    textButton: string | null;
    linkId: number | null;
    active: boolean;
    pageId: number;
    items: SectionItem[];
}

type SectionStatusOption = {
    label: string;
    value: boolean;
    severity: string;
};

type SectionTypeOption = {
    label: string;
    value: SectionType;
};

export const sectionStatusOptions: Record<string, SectionStatusOption> = {
    true: { label: 'Activo', value: true, severity: 'success' },
    false: { label: 'Inactivo', value: false, severity: 'danger' }
};
export const sectionTypesOptions: Record<SectionType, SectionTypeOption> = {
    HERO: { label: 'Hero', value: SectionType.HERO },
    BENEFIT: { label: 'Beneficios', value: SectionType.BENEFIT },
    MACHINE_TYPE: { label: 'Tipo de Máquina', value: SectionType.MACHINE_TYPE },
    BILL_MACHINE: { label: 'Tipo de Factura', value: SectionType.BILL_MACHINE },
    VALUE_PROPOSITION: { label: 'Propuesta de Valor', value: SectionType.VALUE_PROPOSITION },
    COIN_MACHINE: { label: 'Máquina de Monedas', value: SectionType.COIN_MACHINE },
    CLIENT: { label: 'Cliente', value: SectionType.CLIENT },
    CONTACT: { label: 'Contacto', value: SectionType.CONTACT },
    FOOTER: { label: 'Footer', value: SectionType.FOOTER }
};
