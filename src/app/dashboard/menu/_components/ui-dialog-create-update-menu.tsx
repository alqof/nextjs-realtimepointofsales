import FormInputSet from "@/components/form-input-set";
import FormSelectSet from "@/components/form-select-set";
import FormImageSet from "@/components/form.image";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { INITAL_MENU_ISAVAILABLE, INITIAL_MENU_CATEGORY } from "@/lib/constants/menu-constants";
import { Preview } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function UiDialogCreateUpdateMenu<T extends FieldValues>(
    { 
        formresolve, 
        onSubmit, 
        isLoading, 
        type,
        preview, 
        setPreview
    }: {
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
                    <DialogTitle> {type} Menu </DialogTitle>
                    <DialogDescription> { type === 'Create' ? 'Add a new menu' : 'Make changes menu here' } </DialogDescription>
                </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="max-h-[70vh] overflow-y-auto p-3 space-y-4">
                            <FormInputSet formresolve={formresolve} label="Name" name={'name' as Path<T>} type="" placeholder="Insert name..." />
                            <FormInputSet formresolve={formresolve} label="Description" name={'description' as Path<T>} type="textarea" placeholder="Insert description..." />
                            <FormInputSet formresolve={formresolve} label="Price" name={'price' as Path<T>} type="number" placeholder="Insert price..." />
                            <FormInputSet formresolve={formresolve} label="Discount" name={'discount' as Path<T>} type="number" placeholder="Insert discount..." />
                            <FormSelectSet formresolve={formresolve} label="Category" name={'category' as Path<T>} selectItem={INITIAL_MENU_CATEGORY} />
                            <FormImageSet formresolve={formresolve} label="Image" name={'image_url' as Path<T>} preview={preview} setPreview={setPreview} />
                            <FormSelectSet formresolve={formresolve} label="Availability" name={'is_available' as Path<T>} selectItem={INITAL_MENU_ISAVAILABLE} />
                        </div>

                        <DialogFooter className="flex flex-row items-center justify-end">
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