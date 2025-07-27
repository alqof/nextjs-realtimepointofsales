import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DialogForm from "./ui-dialog-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function UiDialogDelete(
    { 
        title,
        isLoading,
        onSubmit,
    }: {
        title: string;
        isLoading: boolean;
        onSubmit: ()=>void;
    }
) {
    return(
        <DialogContent>
            <form className="grid gap-6">
                <DialogHeader>
                    <DialogTitle> Delete {title} </DialogTitle>
                    <DialogDescription> Are you sure you want to delete this <span className="lowercase">{title}</span> </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="cursor-pointer" variant="outline"> Cancel </Button>
                    </DialogClose>

                    {/* <Button type="submit"> */}
                    <Button formAction={onSubmit} className="cursor-pointer" variant="destructive">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Delete'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}