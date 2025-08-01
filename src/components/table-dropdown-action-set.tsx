import { ReactNode } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Bolt, Settings, UserCog } from 'lucide-react';


export default function TableColumnDropdownAction({menu}: {
    menu: {
        label: string | ReactNode;
        variant?: 'destructive' | 'default';
        action?: () => void;
        type?: 'item' | 'link';
    }[];
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:bg-muted size-8 cursor-pointer" size="icon">
                    <Bolt />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
                {menu.map((item, index) => (
                    <DropdownMenuItem key={`dropdown-action-${index}`} variant={item.variant || 'default'} asChild={item.type === 'link'} onClick={item.action}>
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
