import FormInputSet from "@/components/form-input-set";
import FormSelectSet from "@/components/form-select-set";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { INITAL_TABLE_STATUS } from "@/lib/constants/table-constant";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function UiDialogCreateUpdateTable<T extends FieldValues>(
    { 
        formresolve, 
        onSubmit, 
        isLoading, 
        type,
    }: {
        formresolve: UseFormReturn<T>;
        onSubmit: (e: FormEvent<HTMLFormElement>)=>void;
        isLoading: boolean;
        type: 'Create' | 'Update';
    }
) {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <Form {...formresolve}>
                <DialogHeader>
                    <DialogTitle> {type} Dining Table </DialogTitle>
                    <DialogDescription> { type === 'Create' ? 'Add a new table' : 'Make changes dining table here' } </DialogDescription>
                </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="max-h-[70vh] overflow-y-auto p-3 space-y-4">
                            <FormInputSet formresolve={formresolve} label="Name" name={'name' as Path<T>} type="" placeholder="E1" />
                            <FormInputSet formresolve={formresolve} label="Description" name={'description' as Path<T>} type="textarea" placeholder="Lantai 5 No.1 dekat pintu" />
                            <FormInputSet formresolve={formresolve} label="Capacity" name={'capacity' as Path<T>} type="number" placeholder="0" />
                            <FormSelectSet formresolve={formresolve} label="Status" name={'status' as Path<T>} selectItem={INITAL_TABLE_STATUS} />
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