
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
            "group flex w-full items-start gap-3 py-4",
            from === "user" ? "justify-start flex-row-reverse is-user" : "justify-start is-assistant",
            from === "user" ? "[&>div]:max-w-[80%]" : "[&>div]:max-w-full",
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
            "flex flex-col gap-2 overflow-hidden text-sm relative",
            "group-[.is-user]:rounded-3xl group-[.is-user]:rounded-tr-sm group-[.is-user]:bg-white/10 group-[.is-user]:px-5 group-[.is-user]:py-3 group-[.is-user]:text-white",
            "group-[.is-assistant]:bg-transparent group-[.is-assistant]:text-foreground group-[.is-assistant]:px-0 group-[.is-assistant]:py-2",
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
            "size-8 border border-white/10 shrink-0 select-none",
            className
        )}
        {...props}
    >
        {src && <AvatarImage alt="" className="mt-0 mb-0" src={src} />}
        <AvatarFallback className="bg-zinc-800 text-[10px] font-medium text-zinc-400">
            {name?.slice(0, 2).toUpperCase() || "AI"}
        </AvatarFallback>
    </Avatar>
);
