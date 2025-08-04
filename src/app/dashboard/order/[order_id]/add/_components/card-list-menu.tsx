import { menuSchemaValidation } from "@/lib/validations/validation-menu";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { convertIDR } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CardListMenu(
    { 
        menu, 
        handleAddToCart ,
    }: { 
        menu: menuSchemaValidation; 
        handleAddToCart: (menu: menuSchemaValidation, action: 'increment'|'decrement') => void; 
    }
) {
    return (
        <Card key={menu.id} className="w-full h-fit birder shadow-sm p-0 gap-0">
            <Avatar className="w-full h-72 rounded-lg shadow-md">
                <AvatarImage src={menu.image_url as string} alt="preview" className="object-cover"/>
                <AvatarFallback className="rounded-lg w-full h-full flex items-center justify-center">
                    <Loader2 className='animate-spin'/>
                </AvatarFallback>
            </Avatar>
            {/* <Image src={`${menu.image_url}`} alt={menu.name} width={400} height={400} className="w-full object-cover rounded-t-lg" /> */}

            <CardContent className="px-4 py-2">
                <h3 className="text-lg font-semibold"> {menu.name} </h3>
                <p className="text-sm text-muted-foreground line-clamp-2"> {menu.description} </p>
            </CardContent>

            <CardFooter className="p-4 flex justify-between items-center">
                <div className="text-xl font-bold"> {convertIDR(menu.price)} </div>
                <Button className="cursor-pointer" onClick={() => handleAddToCart(menu, 'increment')}>
                    <ShoppingCart />
                </Button>
            </CardFooter>
        </Card>
    );
}
