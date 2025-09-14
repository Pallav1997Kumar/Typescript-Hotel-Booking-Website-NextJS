// Function to get the day of the date
const getOnlyDate = (date: Date): number => {
    const onlyDate: number = date.getDate();
    return onlyDate;
};

// Function to get the month of the date (formatted as a string)
const getOnlyMonth = (date: Date): string => {
    const month: number = date.getMonth();
    const monthNames: string[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const onlyMonth: string = monthNames[month];
    return onlyMonth;
};

// Function to get the year of the date
const getOnlyYear = (date: Date): number => {
    const onlyYear: number = date.getFullYear();
    return onlyYear;
};

// Function to get the day of the week (like Monday, Tuesday, etc.)
const getOnlyDay = (date: Date): string => {
    const day: number = date.getDay();
    const dayNames: string[] = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const onlyDay: string = dayNames[day];
    return onlyDay;
};

// Function to get the next day of a given date
const nextDay = (date: Date): Date => {
    const newDate: Date = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
};

// Function to get the ordinal suffix (st, nd, rd, th) for a date
const getDateOrdinal = (onlyDate: number): string => {
    let ordinal: string = 'th';
    if ((onlyDate % 10 === 1) && ((onlyDate % 100 !== 11))) {
        ordinal = 'st';
    } else if ((onlyDate % 10 === 2) && ((onlyDate % 100 !== 12))) {
        ordinal = 'nd';
    } else if ((onlyDate % 10 === 3) && ((onlyDate % 100 !== 13))) {
        ordinal = 'rd';
    }
    return ordinal;
};

// Function to get a formatted date string (e.g., 1st January 2024, Monday)
const getDateText = (fullDate: Date): string => {
    const onlyDate: number = getOnlyDate(fullDate);
    const onlyMonth: string = getOnlyMonth(fullDate);
    const onlyYear: number = getOnlyYear(fullDate);
    const onlyDay: string = getOnlyDay(fullDate);
    const dateOrdinal: string = getDateOrdinal(onlyDate);
    const dateText: string = `${onlyDate}${dateOrdinal} ${onlyMonth} ${onlyYear}, ${onlyDay}`;
    return dateText;
};

// Function to get a formatted date string from a full date (with "T")
const getDateTextFromFullDate = (fullDate: string): string => {
    const dateTextArray: string[] = fullDate.split('T');
    const date: Date = new Date(dateTextArray[0]);
    const dateText: string = getDateText(date);
    return dateText;
};

// Function to get a formatted date string from only the date part
const getDateTextFromOnlyDate = (fullDate: string): string => {
    const date: Date = new Date(fullDate);
    const dateText: string = getDateText(date);
    return dateText;
};

// Function to get an array of dates between start and end date (exclusive)
const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const date: Date = new Date(startDate.getTime());
    const dates: Date[] = [];
    while (date < endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

// Function to get an array of dates between start and end date (inclusive)
const getDatesInRangeInclusiveBothDate = (startDate: Date, endDate: Date): Date[] => {
    const date: Date = new Date(startDate.getTime());
    const dates: Date[] = [];
    while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

// Function to convert a date text to the format "yyyy-mm-dd"
const convertDateTextToDate = (dateText: string): string => {
    const localDate: string = new Date(dateText).toLocaleDateString('en-IN'); // "9/6/2024"
    const localDateArray: string[] = localDate.split("/");
    const year: string = localDateArray[2];
    let month: string = localDateArray[1].toString();
    if (month.length === 1) {
        month = "0".concat(month);
    }
    let date: string = localDateArray[0].toString();
    if (date.length === 1) {
        date = "0".concat(date);
    }
    const finalDateString: string = `${year}-${month}-${date}`;
    return finalDateString;
};

// Function to convert UTC time to IST time zone
const utcTimeToISTConvesion = (date: string): string => {
    const utcDate: Date = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata', // IST timezone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-hour format
    };
    const istDate: string = new Intl.DateTimeFormat('en-IN', options).format(utcDate);
    return istDate;
};

const calculateAgeFromDob = (dob: string): number => {
    const birthDate: Date = new Date(dob);
    const today: Date = new Date();
    let age: number = today.getFullYear() - birthDate.getFullYear();
    const monthDiff: number = today.getMonth() - birthDate.getMonth();
    const dayDiff: number = today.getDate() - birthDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    
    return age;
};


const getNextMidnightUTC = (dateInput: Date | string | number): string => {
    const original: Date = new Date(dateInput);
    
    // Extract UTC components
    const year: number = original.getUTCFullYear();
    const month: number = original.getUTCMonth();
    const day: number = original.getUTCDate() + 1;

    // Construct new date: midnight UTC of the next day
    const nextMidnightUTC: Date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    return nextMidnightUTC.toISOString();  // Format: 'YYYY-MM-DDT00:00:00.000Z'
}

// Added type to the function export structure
export {
    getOnlyDate,
    getOnlyMonth,
    getOnlyYear,
    getOnlyDay,
    nextDay,
    getDatesInRange,
    getDatesInRangeInclusiveBothDate,
    convertDateTextToDate,
    getDateOrdinal,
    getDateText,
    getDateTextFromFullDate,
    getDateTextFromOnlyDate,
    utcTimeToISTConvesion,
    calculateAgeFromDob,
    getNextMidnightUTC
};
