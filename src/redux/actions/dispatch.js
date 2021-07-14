import { DISPATCH_STOCK, RESET_DISPATCH } from '../type';

export const dispatchStock = (dispatch_stock) => {
    return {
        type: DISPATCH_STOCK,
        dispatch_stock
    };
}

export const resetDispatch = () => {
    return {
        type: RESET_DISPATCH
    };
}