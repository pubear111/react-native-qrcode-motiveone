import { RESET_RETURNED, RETURNED_STOCK } from '../type';

export const returnedStock = (returned_stock) => {
    return {
        type: RETURNED_STOCK,
        returned_stock
    };
}

export const resetReturned = () => {
    return {
        type: RESET_RETURNED
    };
}