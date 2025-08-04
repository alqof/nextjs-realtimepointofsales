import { menuSchemaValidation } from "@/lib/validations/validation-menu";
import { useMemo } from "react";

export function usePricing(ordersMenus: { menus: menuSchemaValidation; quantity: number }[] | null | undefined) {
    const totalPrice = useMemo(() => {
        let total = 0;
        ordersMenus?.forEach((item) => {
            total += item.menus.price * item.quantity;
        });
        return total;
    }, [ordersMenus]);
    const tax = useMemo(() => {
        return Math.round(totalPrice * 0.12);
    }, [totalPrice]);
    const service = useMemo(() => {
        return Math.round(totalPrice * 0.05);
    }, [totalPrice]);
    const grandTotal = useMemo(() => {
        return totalPrice + tax + service;
    }, [totalPrice, tax, service]);

    return { totalPrice, tax, service, grandTotal };
}