"use client";

import React, { useEffect, useState } from "react";
import { CodeBlock as BaseCodeBlock, type CodeBlockProps } from "@v0-sdk/react";
import { cn } from "@/lib/utils";

/**
 * Code block implementation using Prism.js for syntax highlighting
 */
export function CodeBlock({
    language,
    code,
    className,
    ...props
}: Omit<CodeBlockProps, "children">) {
    const [highlightedCode, setHighlightedCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const highlightCode = async () => {
            try {
                // Dynamically import Prism to avoid SSR issues
                const Prism = (await import("prismjs")).default;

                // Import common language components
                await Promise.all([
                    import("prismjs/components/prism-javascript"),
                    import("prismjs/components/prism-typescript"),
                    import("prismjs/components/prism-jsx"),
                    import("prismjs/components/prism-tsx"),
                    import("prismjs/components/prism-python"),
                    import("prismjs/components/prism-json"),
                    import("prismjs/components/prism-css"),
                    import("prismjs/components/prism-bash"),
                ]).catch(() => {
                    // Ignore errors for missing language components
                });

                if (!mounted) return;

                // Normalize language name
                const normalizedLang = normalizeLanguage(language);

                // Check if language is supported
                if (Prism.languages[normalizedLang]) {
                    const highlighted = Prism.highlight(
                        code,
                        Prism.languages[normalizedLang],
                        normalizedLang
                    );
                    setHighlightedCode(highlighted);
                } else {
                    // Fallback to plain text
                    setHighlightedCode(escapeHtml(code));
                }
            } catch (error) {
                console.warn("Failed to highlight code:", error);
                if (mounted) {
                    setHighlightedCode(escapeHtml(code));
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        highlightCode();

        return () => {
            mounted = false;
        };
    }, [code, language]);

    return (
        <BaseCodeBlock
            {...props}
            language={language}
            code={code}
            className={cn(
                "bg-gray-900/50 border border-white/10 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4",
                className
            )}
        >
            {isLoading ? (
                <pre className="text-gray-500 font-mono text-xs">Loading code...</pre>
            ) : (
                <pre className="font-mono text-sm">
                    <code
                        className={`language-${normalizeLanguage(language)} text-gray-200`}
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                </pre>
            )}
        </BaseCodeBlock>
    );
}

function normalizeLanguage(lang: string): string {
    const langMap: Record<string, string> = {
        js: "javascript",
        ts: "typescript",
        tsx: "tsx",
        jsx: "jsx",
        py: "python",
        sh: "bash",
        shell: "bash",
        json: "json",
        css: "css",
    };

    return langMap[lang.toLowerCase()] || lang.toLowerCase();
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
