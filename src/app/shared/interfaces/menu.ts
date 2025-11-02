import { Link } from './link';

export interface Menu {
    id: number;
    title: string;
    active: boolean;
    parentId: number | null;
    linkId: number | null;
    children: Menu[] | null;
    link: Link | null;
    parent: Menu | null;
}

type MenuActiveStatus = {
    label: string;
    icon: string;
    value: boolean;
    severity: 'success' | 'danger';
};

export const menuActiveStatusOptions: Record<string, MenuActiveStatus> = {
    true: {
        label: 'Activo',
        icon: 'pi pi-check',
        value: true,
        severity: 'success'
    },
    false: {
        label: 'Inactivo',
        icon: 'pi pi-times',
        value: false,
        severity: 'danger'
    }
};
