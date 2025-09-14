function convertToINR(price: number): string{    
    const formattedPrice: string = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(price);
    return formattedPrice;
}

export { convertToINR };