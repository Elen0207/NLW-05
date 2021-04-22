export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration / 3600); // 3600 é igual à 60(segundos) x 60(minutos), ou seja, a quantidade de segundos que tem em uma hora
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const timeString =[hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':')

    return timeString;
}