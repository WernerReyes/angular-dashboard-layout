import { SectionMode, SectionType } from '../mappers/section.mapper';
import { Link } from './link';
import { Machine } from './machine';
import { Menu } from './menu';
import { Page } from './page';
import { SectionItem } from './section-item';
import { Severity } from './severity';


export type PivotPages = {
    idPage: number;
    orderNum: number;
    active: boolean;
    type: SectionMode;
}

export interface Section {
    id: number;
    type: SectionType;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    textButton: string | null;
    linkId: number | null;
    image: string | null;
    items: SectionItem[];
    link: Link | null;
    menus: Menu[];
    pages: (Page & { pivot?: PivotPages })[] | null;
    pivotPages: PivotPages[] | null;
    machines: Machine[] | null;
    
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

type SectionModeOption = {
    label: string;
    value: SectionMode;
    severity: Severity;
}

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
    ADVANTAGES: { label: 'Ventajas Competitivas', value: SectionType.ADVANTAGES, severity: 'contrast' },
    SUPPORT_MAINTENANCE: { label: 'Soporte y Mantenimiento', value: SectionType.SUPPORT_MAINTENANCE, severity: 'info' },
    PRODUCT_DETAILS: { label: 'Detalles del Producto', value: SectionType.PRODUCT_DETAILS, severity: 'success' }
};


export const sectionModeOptions: Record<SectionMode, SectionModeOption> = {
    CUSTOM: { label: 'Personalizado', value: SectionMode.CUSTOM, severity: 'info' },
    LAYOUT: { label: 'Diseño', value: SectionMode.LAYOUT, severity: 'warn' }
};