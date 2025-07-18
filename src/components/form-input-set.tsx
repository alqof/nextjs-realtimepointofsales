import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";


export default function FormInputSet<T extends FieldValues>({
    className,
    formresolve,
    label,
    name,
    type = "text",
    placeholder = "Type your message here.",
}: {
    className?: string
    formresolve: UseFormReturn<T>
    label: string
    name: Path<T>
    type: string
    placeholder: string
}) {
    return (
        <FormField control={formresolve.control} name={name} render={({ field }) => (
            <FormItem className={className}>
                <FormLabel> {label} </FormLabel>
                <FormControl>
                    {type === 'textarea' ? (
                        <Textarea {...field} placeholder={placeholder} />
                    ) : (
                        <Input {...field} type={type} placeholder={placeholder} autoComplete='off' />
                    )}
                </FormControl>
                <FormMessage className='text-xs' />
            </FormItem>
        )} />
    );
}