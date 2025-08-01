import { menuSchemaValidation } from "../validations/validation-menu";

// USER MANAGEMENT
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

export type Preview = {
    file: File; 
    displayUrl: string
}


// MENU MANAGEMENT
export type menuFormState = {
    status?: string;
    errors?: {
        id?: string[];
        name?: string[];
        description?: string[];
        price?: string[];
        discount?: string[];
        category?: string[];
        image_url?: string[];
        is_available?: string[];
        _form?: string[];
    };
}

// TABLE MANAGEMENT
export type tableFormState = {
    status?: string;
    errors?: {
        id?: string[];
        name?: string[];
        description?: string[];
        capacity?: string[];
        status?: string[];
        _form?: string[];
    };
}

// ORDER MANAGEMENT
export type orderFormState = {
    status?: string;
    errors?: {
        customer_name?: string[];
        table_id?: string[];
        status?: string[];
        _form?: string[];
    };
}

export type cartState = {
    order_id?: string;
    menu_id: string;
    menu: menuSchemaValidation;
    notes: string;
    quantity: number;
    total: number;
};