"use client";

import Editor from "@monaco-editor/react";

interface CodeViewerProps {
    content: string;
    language: string;
    theme?: "vs-dark" | "light"; // Default to dark
}

export function CodeViewer({ content, language, theme = "vs-dark" }: CodeViewerProps) {
    const handleEditorWillMount = (monaco: any) => {
        monaco.editor.defineTheme("vibe-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "", foreground: "94a3b8" }, // slate-400
                { token: "comment", foreground: "475569" }, // slate-600
                { token: "keyword", foreground: "60a5fa" }, // blue-400
                { token: "string", foreground: "93c5fd" }, // blue-300
                { token: "number", foreground: "34d399" }, // emerald-400
                { token: "delimiter", foreground: "64748b" }, // slate-500
            ],
            colors: {
                "editor.background": "#06070a",
                "editor.foreground": "#94a3b8",
                "editor.lineHighlightBackground": "#ffffff05",
                "editor.selectionBackground": "#3b82f630", // blue-500 at 30%
                "editorCursor.foreground": "#60a5fa", // blue-400
                "editorLineNumber.foreground": "#334155", // slate-700
                "editorLineNumber.activeForeground": "#94a3b8", // slate-400
                "editorIndentGuide.background": "#ffffff08",
                "editorIndentGuide.activeBackground": "#ffffff15",
            },
        });
    };

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                defaultLanguage="typescript"
                language={language}
                value={content}
                theme="vibe-dark"
                beforeMount={handleEditorWillMount}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: "on",
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    );
}
