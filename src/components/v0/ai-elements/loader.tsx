
import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

export const Loader = ({
    className,
    size = 16,
    ...props
}: {
    className?: string
    size?: number
} & React.SVGProps<SVGSVGElement>) => {
    return (
        <Loader2Icon
            className={cn("animate-spin", className)}
            size={size}
            {...props}
        />
    )
}
