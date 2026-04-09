
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
                "h-10 rounded-full border-white/10 bg-[#161a24]/40 px-6 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 shadow-lg active:scale-95",
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
