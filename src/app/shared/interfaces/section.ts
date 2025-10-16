import { SectionType } from '../mappers/section.mapper';
import { Link } from './link';
import { Menu } from './menu';
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
    image: string | null;
    active: boolean;
    pageId: number;
    items: SectionItem[];
    link: Link | null;
    menus: Menu[];
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
    WHY_US: { label: '¿Por qué nosotros?', value: SectionType.WHY_US, severity: 'info' },
    CASH_PROCESSING_EQUIPMENT: { label: 'Equipos para Procesamiento de Efectivo', value: SectionType.CASH_PROCESSING_EQUIPMENT, severity: 'warn' },
    VALUE_PROPOSITION: { label: 'Propuesta de Valor', value: SectionType.VALUE_PROPOSITION, severity: 'contrast' },
    CLIENT: { label: 'Cliente', value: SectionType.CLIENT, severity: 'info' },
    OUR_COMPANY: { label: 'Nuestra Empresa', value: SectionType.OUR_COMPANY, severity: 'success' },
    MACHINE: { label: 'Máquina', value: SectionType.MACHINE, severity: 'warn' },
    CONTACT_TOP_BAR: { label: 'Barra de Contacto', value: SectionType.CONTACT_TOP_BAR, severity: 'danger' },
    MAIN_NAVIGATION_MENU: { label: 'Menú de Navegación Principal', value: SectionType.MAIN_NAVIGATION_MENU, severity: 'info' },
    CTA_BANNER: { label: 'Banner Informativo', value: SectionType.CTA_BANNER, severity: 'info' },
    SOLUTIONS_OVERVIEW: {
        label: 'Resumen de Soluciones',
        value: SectionType.SOLUTIONS_OVERVIEW,
        severity: 'info'
    },
    MISSION_VISION: { label: 'Misión y Visión', value: SectionType.MISSION_VISION, severity: 'success' },
    CONTACT_US: { label: 'Contáctanos', value: SectionType.CONTACT_US, severity: 'danger' },
    FOOTER: { label: 'Pie de Página', value: SectionType.FOOTER, severity: 'warn' },
    

    // BENEFIT: { label: 'Beneficios', value: SectionType.BENEFIT, severity: 'success' },
    // MACHINE_TYPE: { label: 'Tipo de Máquina', value: SectionType.MACHINE_TYPE, severity: 'warn' },
    // BILL_MACHINE: { label: 'Tipo de Factura', value: SectionType.BILL_MACHINE, severity: 'danger' },
    // COIN_MACHINE: { label: 'Máquina de Monedas', value: SectionType.COIN_MACHINE, severity: 'contrast' },
    // CONTACT: { label: 'Contacto', value: SectionType.CONTACT, severity: 'danger' },
};
