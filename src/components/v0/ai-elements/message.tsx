
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ComponentProps, HTMLAttributes } from "react";

export type MessageRole = "user" | "assistant" | "system" | "data";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
    from: MessageRole;
};

export const Message = ({ className, from, ...props }: MessageProps) => (
    <div
        className={cn(
            "group flex w-full items-start gap-4 py-6",
            from === "user" ? "justify-start flex-row-reverse is-user" : "justify-start is-assistant",
            from === "user" ? "[&>div]:max-w-[85%]" : "[&>div]:max-w-full",
            className
        )}
        {...props}
    />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
    children,
    className,
    ...props
}: MessageContentProps) => (
    <div
        className={cn(
            "flex flex-col gap-2 overflow-hidden text-sm relative leading-relaxed",
            "group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-none group-[.is-user]:bg-blue-600/10 group-[.is-user]:border group-[.is-user]:border-blue-500/20 group-[.is-user]:px-6 group-[.is-user]:py-4 group-[.is-user]:text-slate-100 group-[.is-user]:shadow-lg group-[.is-user]:shadow-blue-500/5",
            "group-[.is-assistant]:bg-transparent group-[.is-assistant]:text-slate-200 group-[.is-assistant]:px-0 group-[.is-assistant]:py-2",
            className
        )}
        {...props}
    >
        <div>{children}</div>
    </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
    src?: string;
    name?: string;
};

export const MessageAvatar = ({
    src,
    name,
    className,
    ...props
}: MessageAvatarProps) => (
    <Avatar
        className={cn(
            "size-9 border border-white/5 shrink-0 select-none shadow-xl",
            className
        )}
        {...props}
    >
        {src && <AvatarImage alt="" className="mt-0 mb-0" src={src} />}
        <AvatarFallback className="bg-[#161a24] text-[10px] font-bold text-blue-400 uppercase tracking-widest border border-blue-500/20 shadow-inner">
            {name?.slice(0, 2).toUpperCase() || "AI"}
        </AvatarFallback>
    </Avatar>
);
