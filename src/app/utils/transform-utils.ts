export class TransformUtils {
    static toFormData(data: Record<string, any>): FormData {
        const formData = new FormData();
        for (const key in data) {
            const value = data[key];
            if (value === null || value === undefined) continue;
            if (Array.isArray(data[key])) {
                data[key].forEach((value: any) => {
                    formData.append(`${key}[]`, value);
                });
            } else {
                if (data.hasOwnProperty(key)) {
                    formData.append(key, data[key]);
                }
            }
        }
        return formData;
    }
}
