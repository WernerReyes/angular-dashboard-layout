import { Link } from './link';

export interface Menu {
    id: number;
    title: string;
    parentId: number | null;
    linkId: number | null;
    children: Menu[] | null;
    link: Link | null;
    parent: Menu | null;
    createdAt: Date;
    updatedAt: Date;
}


