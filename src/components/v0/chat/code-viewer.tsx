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
                { token: "", foreground: "d1d5db" }, // gray-300
                { token: "comment", foreground: "6b7280" }, // gray-500
                { token: "keyword", foreground: "818cf8" }, // indigo-400
                { token: "string", foreground: "a5b4fc" }, // indigo-300
                { token: "number", foreground: "c084fc" }, // purple-400
                { token: "delimiter", foreground: "9ca3af" }, // gray-400
            ],
            colors: {
                "editor.background": "#0a0a0f",
                "editor.foreground": "#d1d5db",
                "editor.lineHighlightBackground": "#ffffff05",
                "editor.selectionBackground": "#6366f130", // indigo-500 at 30%
                "editorCursor.foreground": "#818cf8", // indigo-400
                "editorLineNumber.foreground": "#4b5563", // gray-600
                "editorLineNumber.activeForeground": "#d1d5db", // gray-300
                "editorIndentGuide.background": "#ffffff10",
                "editorIndentGuide.activeBackground": "#ffffff20",
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
