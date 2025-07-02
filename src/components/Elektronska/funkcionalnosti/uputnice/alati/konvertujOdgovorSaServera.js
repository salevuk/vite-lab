export const konvertujOdgovorSaServera = (odgovor) => {
    const { columns, data } = odgovor;

    // Combine columns and data
    return data.map(row => {
        return row.reduce((acc, value, index) => {
            acc[columns[index]] = value;
            return acc;
        }, {});
    });
};