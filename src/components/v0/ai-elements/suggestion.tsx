
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
                "h-9 rounded-xl border-white/5 bg-[#161a24]/40 px-5 text-[11px] font-bold text-slate-400 transition-all hover:bg-blue-600/10 hover:border-blue-500/30 hover:text-blue-400 shadow-lg active:scale-95 uppercase tracking-wide",
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
