import { SectionType } from '../mappers/section.mapper';
import { SectionItem } from './section-item';
import { Severity } from './severity';

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
    severity: Severity;
};

type SectionTypeOption = {
    label: string;
    value: SectionType;
    severity: Severity;
};

export const sectionStatusOptions: Record<string, SectionStatusOption> = {
    true: { label: 'Activo', value: true, severity: 'success' },
    false: { label: 'Inactivo', value: false, severity: 'danger' }
};
export const sectionTypesOptions: Record<SectionType, SectionTypeOption> = {
    HERO: { label: 'Hero', value: SectionType.HERO, severity: 'info' },
    BENEFIT: { label: 'Beneficios', value: SectionType.BENEFIT, severity: 'success' },
    MACHINE_TYPE: { label: 'Tipo de Máquina', value: SectionType.MACHINE_TYPE, severity: 'warn' },
    BILL_MACHINE: { label: 'Tipo de Factura', value: SectionType.BILL_MACHINE, severity: 'danger' },
    VALUE_PROPOSITION: { label: 'Propuesta de Valor', value: SectionType.VALUE_PROPOSITION, severity: 'secondary' },
    COIN_MACHINE: { label: 'Máquina de Monedas', value: SectionType.COIN_MACHINE, severity: 'contrast' },
    CLIENT: { label: 'Cliente', value: SectionType.CLIENT, severity: 'info' },
    CONTACT: { label: 'Contacto', value: SectionType.CONTACT, severity: 'danger' },
    FOOTER: { label: 'Footer', value: SectionType.FOOTER, severity: 'warn' }
};
