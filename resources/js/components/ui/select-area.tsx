import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface SelectAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    label?: string;
    error?: string;
    withAsterisk?: boolean;
    formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
}

export function SelectArea({
    children,
    label,
    error,
    withAsterisk = false,
    formLabelProps,
    className,
    ...props
}: SelectAreaProps) {
    return (
        <div className={cn("space-y-2", className)} {...props}>
            {label && (
                <Label {...formLabelProps}>
                    {label}{" "}
                    {withAsterisk && <span className="text-red-500">*</span>}
                </Label>
            )}
            {children}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default SelectArea;
