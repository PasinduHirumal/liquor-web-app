
const calculateDiscount = (markedPrice, discountPercentage) => {
    const marked_price = markedPrice ?? 0;
    const discount_percentage = discountPercentage ?? 0;
    
    if (discount_percentage <= 0) {
        const discount = 0;

        return discount;
    }

    const discount = marked_price * (discount_percentage / 100);

    return discount;
};

const calculateNewPrice = (markedPrice, discount) => {
    const newPrice = markedPrice - discount;

    return newPrice;
}


const validatePriceOperation = (markedPrice, discountPercentage) => {
    const discount = calculateDiscount(markedPrice, discountPercentage);
    const newPrice = calculateNewPrice(markedPrice, discount);

    let isUpdatingPrice = false;
    if (newPrice !== markedPrice){
        isUpdatingPrice = true;
    }

    if (newPrice < 0) {
        return {
            isValid: false,
            isUpdatingPrice,
            error: "Discount is grater than marked price"
        };
    }
    
    return {
        isValid: true,
        isUpdatingPrice,
        newPrice,
        discount
    };
};

export { calculateDiscount, calculateNewPrice, validatePriceOperation };