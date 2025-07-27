// LOGIN
export const INITIAL_FORM_LOGIN = {
    email: '',
    password: '',
}
export const INITIAL_STATE_LOGIN = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        _form: [],
    },
}
export const INITIAL_STATE_PROFILE = {
    id: '',
    name: '',
    role: '',
    image_url: '',
}

// CREATE USER
export const INITIAL_FORM_CREATE_USER = {
    name: '',
    email: '',
    password: '',
    role: '',
    image_url: '',
}
export const INITIAL_STATE_CREATE_USER = {
    status: 'idle',
    errors: {
        name: [],
        email: [],
        password: [],
        role: [],
        image_url: [],
        _form: [],
    },
}

// UPDATE USER
export const INITIAL_STATE_UPDATE_USER = {
    status: 'idle',
    errors: {
        name: [],
        role: [],
        image_url: [],
        _form: [],
    },
}




// GENERAL
export const INITIAL_ROLE = [
    {
        value: 'admin',
        label: 'Admin',
    },
    {
        value: 'kitchen',
        label: 'Kitchen',
    },
    {
        value: 'cashier',
        label: 'Cashier',
    },
]
export const INITIAL_ACTION_STATE = {
    status: 'idle',
    errors: { _form: [] }
}