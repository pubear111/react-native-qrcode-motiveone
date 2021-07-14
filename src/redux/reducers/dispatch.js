import { DISPATCH_STOCK, RESET_DISPATCH } from '../type';

const initialState = {
    dispatch_stocks: []
}

const dispatch = (state = initialState, action) => {
    switch (action.type) {
        case DISPATCH_STOCK:
            return {
                ...state,
                dispatch_stocks: state.dispatch_stocks.concat({
                    value: action.dispatch_stock
                })
            };
        case RESET_DISPATCH:
            return initialState;
        default:
            return state;
    }
}

export default dispatch