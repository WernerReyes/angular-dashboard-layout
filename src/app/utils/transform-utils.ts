export class TransformUtils {
    static toFormData(data: Record<string, any>): FormData {
        const formData = new FormData();
        for (const key in data) {
            const value = data[key];
            if (value === null || value === undefined) continue;
            if (Array.isArray(data[key])) {
                // if (typeof data[key][0] === 'object') {
                //     formData.append(key, JSON.stringify(data[key]));
                //     continue;
                // }

                data[key].forEach((value: any) => {
                    let finalValue = value;
                    console.log(value instanceof File, value);
                    if (!(value instanceof File) && typeof value === 'object') {
                        finalValue = JSON.stringify(value); 
                    }
                    // if (typeof value === 'object') {
                    //     formData.append(`${key}[]`, JSON.stringify(value));
                    // } else {
                        formData.append(`${key}[]`, finalValue);
                    // }
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
