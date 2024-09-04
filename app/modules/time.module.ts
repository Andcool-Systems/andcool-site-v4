export const fullYearsDifference = (date1: Date, date2: Date) => {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    let diff = year2 - year1;

    if (
        date2.getMonth() < date1.getMonth() ||
        (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())
    ) {
        diff--;
    }

    return diff;
}

export const getTime = (): string => {
    return new Date().toLocaleString('ru-RU', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Etc/GMT-3'
    });
}
