
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface SuggestionProps {
    suggestion: string
    onClick: () => void
    disabled?: boolean
    className?: string
}

export function Suggestion({
    suggestion,
    onClick,
    disabled,
    className,
}: SuggestionProps) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "h-8 rounded-full border-muted-foreground/20 px-4 text-xs font-normal text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
                className
            )}
        >
            {suggestion}
        </Button>
    )
}

export interface SuggestionsProps {
    children: React.ReactNode
    className?: string
}

export function Suggestions({ children, className }: SuggestionsProps) {
    return (
        <div
            className={cn(
                "flex w-full flex-wrap items-center justify-center gap-2 px-4 py-4",
                className
            )}
        >
            {children}
        </div>
    )
}
