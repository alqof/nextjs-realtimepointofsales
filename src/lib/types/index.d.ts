export type authFormState = {
    status?: string;
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
        image_url?: string[];
        _form?: string[];
    };
}

export type formState = {
    errors?: {
        _form?: string[];
    };
    status?: string;
}

export type profileState = {
    id?: string;
    name?: string;
    role?: string;
    image_url?: string;
}