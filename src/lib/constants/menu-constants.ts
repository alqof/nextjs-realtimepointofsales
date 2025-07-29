export const INITIAL_MENU_CATEGORY = [
    {
        value: 'Coffee',
        label: 'Coffee',
    },
    {
        value: 'Non Coffee',
        label: 'Non Coffee',
    },
    {
        value: 'Food',
        label: 'Food',
    },
    {
        value: 'Snack',
        label: 'Snack',
    },
]
export const INITAL_MENU_ISAVAILABLE = [
    {
        value: 'true',
        label: 'Available',
    },
    {
        value: 'false',
        label: 'Not Available',
    },
]

export const INITIAL_FORM_MENU = {
    name: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    image_url: '',
    is_available: '',
};


export const INITIAL_STATE_CREATE_UPDATE_MENU = {
    status: 'idle',
    errors: {
        id: [],
        name: [],
        description: [],
        price: [],
        discount: [],
        category: [],
        image_url: [],
        is_available: [],
        _form: [],
    },
};
