import { DateTime } from 'luxon';

export async function convertSeconds(date: Date) {
    const currentDateTime = DateTime.local();
    const currentDateTimeInMillis = currentDateTime.toMillis(); 
    const dateInMillis = date.getTime(); 
    const seconds = Math.floor((dateInMillis - currentDateTimeInMillis) / 1000); 
    return seconds;
}