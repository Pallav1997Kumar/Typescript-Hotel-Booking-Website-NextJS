// Function to convert an array into a comma-separated string
const getCommaAndSeperatedArray = (arr: string[]): string => {
    let text:string = "";
    const arrayLength:number = arr.length;
    for (let i = 0; i <= (arrayLength - 3); i++) {
        text = text + arr[i] + ", ";
    }
    text = text + arr[arrayLength - 2] + " and " + arr[arrayLength - 1];
    return text;
}

// Function to check if all elements in an array are unique
const isAllElementsUniqueInArray = <T>(arr: T[]): boolean => {
    const uniqueArr = [...new Set(arr)];
    return uniqueArr.length === arr.length;
}

// Function to create subarrays of two elements each
const getSubarraysOfTwoElements = <T>(originalArray: T[]): T[][] => {
    const subarrays: T[][] = [];
    for (let i = 0; i < originalArray.length; i += 2) {
        subarrays.push([originalArray[i], originalArray[i + 1]]);
    }
    return subarrays;
}

// Function to get an array of numbers from 1 to 'number'
const getAllElementsInArrayFormatFromStartToEndOfNumber = (number: number): number[] => {
    const arr: number[] = Array.from({ length: number }, (_, i) => i + 1);
    return arr;
}

export { 
    getCommaAndSeperatedArray, 
    isAllElementsUniqueInArray, 
    getSubarraysOfTwoElements,
    getAllElementsInArrayFormatFromStartToEndOfNumber
};
