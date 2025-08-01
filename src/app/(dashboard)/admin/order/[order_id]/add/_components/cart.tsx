import { Dispatch, SetStateAction, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cartState } from "@/lib/types";
import { convertIDR } from "@/lib/utils";
import Image from "next/image";
import { menuSchemaValidation } from "@/lib/validations/validation-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";



// Hooks Debounce
function useDebounce() {
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
    const debounce = (
        func: ()=>void, 
        delay: number,
    ) => {
        if(debounceTimeout.current) 
            clearTimeout(debounceTimeout.current)

        debounceTimeout.current = setTimeout(()=>{
            func();
            debounceTimeout.current = null;
        }, delay)
    }

    return debounce;
}

export default function Cart(
    { 
        order,
        carts,
        setCarts,
        handleAddToCart,
        handleAddMenuOrder,
        isLoading,
    }: { 
        order: { customer_name: string; tables: { name: string }[]; status: string; } | null | undefined;
        carts: cartState[];
        setCarts: Dispatch<SetStateAction<cartState[]>>;
        handleAddToCart: (item: menuSchemaValidation, type: 'decrement' | 'increment') => void;
        handleAddMenuOrder: ()=>void;
        isLoading: boolean;
    }
){
    const debounce = useDebounce();

    const handleAddNote = (id: string, notes: string) => {
        setCarts(
            carts.map((item) => (item.menu_id === id ? { ...item, notes } : item)),
        );
    };

    return (
        <Card className="w-full shadow-sm">
            <CardContent className="space-y-6">
                {order && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold underline"> Customer Information </h3>
                        <div className="space-y-2">
                            <Label> Name </Label>
                            <Input value={order?.customer_name} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label> Table </Label>
                            <Input value={(order?.tables as unknown as { name: string })?.name} disabled />
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold underline"> Cart </h3>
                    {carts.length > 0 ? (
                        carts?.map((item: cartState) => (
                        <div key={item.menu.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-12 h-12 rounded-lg shadow-md">
                                        <AvatarImage src={item.menu.image_url as string} alt="preview" className="object-cover shadow-md"/>
                                    </Avatar>
                                    {/* <Image src={item.menu.image_url as string} alt={item.menu.name} width={30} height={30} className="rounded" /> */}
                                    <div>
                                        <p className="text-sm">{item.menu.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {convertIDR(item.total / item.quantity)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm">{convertIDR(item.total)}</p>
                            </div>

                            <div className="flex items-center gap-4 w-full">
                                <Input
                                    placeholder="Add Note"
                                    className="w-full"
                                    onChange={(e) =>
                                        debounce(() => handleAddNote(item.menu!.id, e.target.value), 500)
                                    }
                                />
                                <div className="flex items-center gap-4">
                                    <Button className="font-semibold cursor-pointer" variant="outline" onClick={() => handleAddToCart(item.menu!, 'decrement')}> - </Button>
                                    <p className="font-semibold"> {item.quantity} </p>
                                    <Button className="font-semibold cursor-pointer" variant="outline" onClick={() => handleAddToCart(item.menu!, 'increment')}> + </Button>
                                </div>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-sm text-zinc-500"> No item in cart </p>
                    )}

                    <Button className="w-full font-semibold bg-teal-500 hover:bg-teal-600 cursor-pointer text-white" onClick={() => handleAddMenuOrder()}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Add Menu'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
