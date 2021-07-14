import { INVOICE } from '../type';

export const invoice = (customer_code, invoice_date, invoice_number) => {
    return {
        type: INVOICE,
        customer_code: customer_code,
        invoice_date: invoice_date,
        invoice_number: invoice_number
    };
}