export const INITIAL_LOGIN_FORM = {
    email: '',
    password: '',
}

export const INITIAL_LOGIN_STATE = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        _form: [],
    },
}

export const INITIAL_PROFILE_STATE = {
    id: '',
    name: '',
    role: '',
    image_url: '',
}