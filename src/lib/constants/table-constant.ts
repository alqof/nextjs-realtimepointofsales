export const INITAL_TABLE_STATUS = [
    {
        value: 'available',
        label: 'available',
    },
    {
        value: 'unavailable',
        label: 'unavailable',
    },
    {
        value: 'reserved',
        label: 'reserved',
    },
]

export const INITIAL_DEFAULT_FORM_TABLE = {
    name: '',
    description: '',
    capacity: '',
    status: '',
};

export const INITIAL_STATE_CREATE_UPDATE_TABLE = {
    status: 'idle',
    errors: {
        id: [],
        name: [],
        description: [],
        capacity: [],
        status: [],
        _form: [],
    },
};