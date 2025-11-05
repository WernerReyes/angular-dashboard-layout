import { AdditionalInfo, IconType, type Icon } from '../mappers/section-item.mapper';
import { SectionMode, SectionType } from '../mappers/section.mapper';
import type { Link } from './link';
import type { Machine } from './machine';
import type { Menu } from './menu';
import type { Page } from './page';
import type { SectionItem } from './section-item';
import type { Severity } from './severity';

export type PivotPages = {
    idPage: number;
    orderNum: number;
    active: boolean;
    type: SectionMode;
};

export interface Section {
    id: number;
    type: SectionType;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    textButton: string | null;
    extraTextButton: string | null;
    linkId: number | null;
    extraLinkId: number | null;
    image: string | null;
    items: SectionItem[];
    link: Link | null;
    extraLink: Link | null;
    menus: Menu[];
    pages: (Page & { pivot?: PivotPages })[] | null;
    pivotPages: PivotPages[] | null;
    machines: Machine[] | null;
    iconUrl: string | null;
    iconType: IconType | null;
    icon: Icon | null;
    video: string | null;
    additionalInfoList: AdditionalInfo[] | null;
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
};

export const sectionStatusOptions: Record<string, SectionStatusOption> = {
    true: { label: 'Activo', value: true, severity: 'success' },
    false: { label: 'Inactivo', value: false, severity: 'danger' }
};
export const sectionTypesOptions: Record<SectionType, SectionTypeOption> = {
    HERO: { label: 'Portada', value: SectionType.HERO, severity: 'info' },
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
    OPERATIONAL_BENEFITS: { label: 'Beneficios Operacionales', value: SectionType.OPERATIONAL_BENEFITS, severity: 'warn' },
    MACHINE_DETAILS: { label: 'Detalles de la máquina', value: SectionType.MACHINE_DETAILS, severity: 'success' },
    MACHINES_CATALOG: { label: 'Catálogo de Máquinas', value: SectionType.MACHINES_CATALOG, severity: 'contrast' },
    FULL_MAINTENANCE_PLAN: { label: 'Planes de Mantenimiento', value: SectionType.FULL_MAINTENANCE_PLAN, severity: 'info' },
    PREVENTIVE_CORRECTIVE_MAINTENANCE: { label: 'Mantenimiento Preventivo y Correctivo', value: SectionType.PREVENTIVE_CORRECTIVE_MAINTENANCE, severity: 'warn' },
    SUPPORT_WIDGET: { label: 'Widget de Soporte', value: SectionType.SUPPORT_WIDGET, severity: 'info' }
};

export const sectionModeOptions: Record<SectionMode, SectionModeOption> = {
    CUSTOM: { label: 'Personalizado', value: SectionMode.CUSTOM, severity: 'info' },
    LAYOUT: { label: 'Diseño', value: SectionMode.LAYOUT, severity: 'warn' }
};
