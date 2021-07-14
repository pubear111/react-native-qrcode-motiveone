import { INVOICE } from '../type';

const defaultState = {
    customer_code: '',
    invoice_date: '',
    invoice_number: ''
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case INVOICE:
            return Object.assign({}, state, {
                customer_code: action.customer_code,
                invoice_date: action.invoice_date,
                invoice_number: action.invoice_number
            });
        default:
            return state;
    }
}
