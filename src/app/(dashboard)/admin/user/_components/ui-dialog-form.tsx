import FormInputSet from "@/components/form-input-set";
import FormSelectSet from "@/components/form-select-set";
import FormImageSet from "@/components/form.image";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { INITIAL_ROLE } from "@/lib/constants/auth-constant";
import { Preview } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function UiDialogForm<T extends FieldValues>(
    { formresolve, onSubmit, isLoading, type, preview, setPreview}:
    {
        formresolve: UseFormReturn<T>;
        onSubmit: (e: FormEvent<HTMLFormElement>)=>void;
        isLoading: boolean;
        type: 'Create' | 'Update';
        preview?: Preview;
        setPreview?: (preview: Preview | undefined) => void;
    }
) {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <Form {...formresolve}>
                <DialogHeader>
                    <DialogTitle> {type} User </DialogTitle>
                    <DialogDescription> { type === 'Create' ? 'Register a new user' : 'Make changes user here' } </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <FormInputSet formresolve={formresolve} label="Name" name={'name' as Path<T>} type="" placeholder="Insert full name" />
                    {type === 'Create' && (
                        <FormInputSet formresolve={formresolve} name={'email' as Path<T>} label="Email" placeholder="Insert valid email" type="email" />
                    )}
                    <FormSelectSet formresolve={formresolve} label="Role" name={'role' as Path<T>} selectItem={INITIAL_ROLE} />
                    <FormImageSet formresolve={formresolve} name={'image_url' as Path<T>} label="Image" preview={preview} setPreview={setPreview} />
                    {type === 'Create' && (
                        <FormInputSet formresolve={formresolve} label="Password" name={'password' as Path<T>} type="password" placeholder="********" />
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline"> Cancel </Button>
                        </DialogClose>
                        <Button className="cursor-pointer" type="submit">
                            {isLoading ? <Loader2 className="animate-spin" /> : type}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}