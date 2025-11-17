import type lucideData from '@iconify-json/lucide/icons.json';

export type IconName = keyof typeof lucideData.icons;

export class Icons {
    private static cache: any[] | null = null;

    // static getAll() {
    //     return Object.entries(lucideData.icons).map(([name, icon], i) => ({
    //         name: name as IconName,
    //         html: icon.body.replace(/stroke-width="[^"]*"/g, '')
    //     }));
    // }

    static async getAllDinamic(): Promise<{ name: IconName; html: string }[]> {
        if (this.cache) return this.cache;

        const data = await import('@iconify-json/lucide/icons.json');
        this.cache = Object.entries(data.icons).map(([name, icon]) => ({
            name,
            html: icon.body.replace(/stroke-width="[^"]*"/g, '')
        }));

        return this.cache;
    }

    static getHtml(name: string) {
        return this.cache!.find((i) => i.name === name)?.html || null;
    }

    //   static getHtml3(name: IconName) {
    //         const icon = lucideData.icons[name];
    //         console.log('Getting icon html for:', name, icon.body.replace(/stroke-width="[^"]*"/g, ''));
    //         if (!icon) return null;
    //         return icon.body.replace(/stroke-width="[^"]*"/g, '');
    //     }
}
