export const convertToFormData = (data) => {
    const params = new URLSearchParams();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            params.append(key, data[key]);
        }
    }
    return params;
};