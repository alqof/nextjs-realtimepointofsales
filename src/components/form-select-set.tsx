import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export default function FormSelectSet<T extends FieldValues> (
    {
        className,
        formresolve,
        label,
        name,
        selectItem,
    }: {
        className?: string;
        formresolve: UseFormReturn<T>;
        label?: string;
        name: Path<T>;
        selectItem: { //array object
            value: string;
            label: string;
            disable?: boolean
        }[];
    }
){
    return (
        <FormField control={formresolve.control} name={name} render={({field: {onChange, ...rest}}) => (
            <FormItem>
                <FormLabel> {label} </FormLabel>
                <FormControl>
                    <Select {...rest} onValueChange={onChange}>
                        <SelectTrigger className={cn('w-full', {'border-red-600': formresolve.formState.errors[name]?.message})}>
                            <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel> {label} </SelectLabel>
                                {selectItem.map((item)=>(
                                    <SelectItem key={item.label} value={item.value} disabled={item.disable} className="capitalize"> {item.label} </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage className='text-xs'/>
            </FormItem>
        )}/>
    )
}