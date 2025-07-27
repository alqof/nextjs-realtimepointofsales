import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Camera, FileImage, UserRound } from "lucide-react";
import { getImageData } from "@/lib/utils";

export default function FormImageSet<T extends FieldValues>(
    {formresolve, label, name, preview, setPreview}:
    {
        formresolve: UseFormReturn<T>;
        label: string;
        name: Path<T>;
        preview?: {
            file: File;
            displayUrl: string;
        };
        setPreview?: (preview: { file: File; displayUrl: string }) => void;
}
) {
    return(
        <FormField control={formresolve.control} name={name} render={({ field: { onChange, ...rest } }) => (
            <FormItem>
                <FormLabel> {label} </FormLabel>
                <FormControl>
                    <div>
                        <Avatar className="w-24 h-24 mb-2 rounded-lg">
                            <AvatarImage src={preview?.displayUrl} alt="preview" className="object-cover"/>
                            <AvatarFallback className="rounded-lg w-full h-full flex items-center justify-center">
                                <UserRound className="w-2/3 h-2/3"/>
                            </AvatarFallback>
                        </Avatar>
                        <Input
                            id="file-upload"
                            className="hidden"
                            type="file" 
                            name={rest.name} 
                            ref={rest.ref} 
                            onBlur={rest.onBlur} 
                            disabled={rest.disabled} 
                            accept="image/*"
                            onChange={ async (event) => { 
                                    onChange(event);
                                    const { file, displayUrl } = getImageData(event);
                                    if (file) {
                                        setPreview?.({ file, displayUrl });
                                    }
                                }
                            }
                        />
                        <label htmlFor="file-upload" className="w-full max-w-full px-3 py-2 flex items-center justify-center gap-2 border border-dashed border-gray-600 bg-gray-900/80 text-sm text-gray-100 rounded-md cursor-pointer transition hover:bg-gray-800 hover:border-primary" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                            <Camera className="w-4 h-4" />
                            {preview?.file?.name ? (
                                <span className="text-foreground break-words w-full"> {preview.file.name} </span>
                            ) : (
                                <span className="text-muted-foreground">Choose File</span>
                            )}
                        </label>

                        {/* <Avatar className="h-9 w-9 rounded-lg">
                            <AvatarImage src={preview?.displayUrl} alt="preview" className="object-cover"/>
                            <AvatarFallback className="rounded-lg">
                                <FileImage className="w-4 h-4" />
                            </AvatarFallback>
                        </Avatar>
                        <Input 
                            type="file" 
                            name={rest.name} 
                            ref={rest.ref} 
                            onBlur={rest.onBlur} 
                            disabled={rest.disabled} 
                            accept="image/*"
                            onChange={
                                async (event) => { 
                                    onChange(event);
                                    const { file, displayUrl } = getImageData(event);
                                    if (file) {
                                        // onChange(file);
                                        setPreview?.({ file, displayUrl });
                                    }
                                }
                            }
                        /> */}
                    </div>
                </FormControl>
                <FormMessage className="text-xs" />
            </FormItem>
            )}
        />
    )
}