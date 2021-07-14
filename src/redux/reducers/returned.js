import { RESET_RETURNED, RETURNED_STOCK } from '../type';

const initialState = {
    returned_stocks: []
}

const returned = (state = initialState, action) => {
    switch (action.type) {
        case RETURNED_STOCK:
            return {
                ...state,
                returned_stocks: state.returned_stocks.concat({
                    value: action.returned_stock
                })
            };
        case RESET_RETURNED:
            return initialState;
        default:
            return state;
    }
}

export default returned