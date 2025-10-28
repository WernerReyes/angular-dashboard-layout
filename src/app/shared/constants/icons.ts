import lucideData from '@iconify-json/lucide/icons.json';

export type  IconName = keyof typeof lucideData.icons; 

export class Icons {
    static getAll() {
        return Object.entries(lucideData.icons).map(([name, icon], i) => ({
            name: name as IconName,
            html: icon.body.replace(/stroke-width="[^"]*"/g, ''),
        }));
    }

    static getHtml(name: IconName) {
        const icon = lucideData.icons[name];
        if (!icon) return null;
        return icon.body.replace(/stroke-width="[^"]*"/g, '')
    }

   
}
