import { INITIAL_ACTION_STATE } from "./general-constant";

export const INITIAL_DEFAULT_FORM_ORDER = {
    customer_name: '',
    table_id: '',
    status: '',
};

export const INITIAL_STATE_CREATE_ORDER = {
    status: 'idle',
    errors: {
        customer_name: [],
        table_id: [],
        status: [],
        _form: [],
    },
};

export const INITIAL_STATUS_CREATE_ORDER = [
    {
        value: 'reserved',
        label: 'Reserved',
    },
    {
        value: 'process',
        label: 'Process',
    },
];


export const INITIAL_FILTER_MENU = [
    {
        value: '',
        label: 'All',
    },
    {
        value: 'Coffee',
        label: 'Coffee',
    },
    {
        value: 'Non-Coffee',
        label: 'Non-Coffee',
    },
    {
        value: 'Food',
        label: 'Food',
    },
    {
        value: 'Snack',
        label: 'Snack',
    },
];


export const INITIAL_STATE_GENERATE_PAYMENT = {
    ...INITIAL_ACTION_STATE,
    data: {
        payment_token: '',
    },
};
