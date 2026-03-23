import React, { useState } from "react";
import { type CodeProjectPartProps } from "@v0-sdk/react";
import { ChevronRight, ChevronDown, FileText } from "lucide-react";

export function CodeProjectPart({
    title,
    filename,
    collapsed: initialCollapsed = true,
    className,
    code,
    language,
    children,
    iconRenderer,
    ...props
}: CodeProjectPartProps) {
    const [collapsed, setCollapsed] = useState(initialCollapsed);

    return (
        <div className="mb-4" {...props}>
            <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-between p-3 text-left group hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {collapsed ? (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </div>
                        <span className="text-gray-300 text-sm font-medium">
                            {title || "Code Project"}
                        </span>
                    </div>
                </button>

                {!collapsed && (
                    <div className="px-3 pb-3 space-y-1 border-t border-white/10 pt-2">
                        <div className="flex items-center gap-2 text-sm pl-6">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 font-mono text-xs">{filename || "file"}</span>
                        </div>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
