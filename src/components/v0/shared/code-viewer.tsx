import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CodeBlock } from "./code-block";
import {
    DocumentIcon,
    FolderIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    XMarkIcon,
    LockClosedIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface File {
    name: string;
    content: string;
    language?: string;
}

interface CodeViewerProps {
    files?: File[];
    messages?: any[];
}

type FileNode = {
    name: string;
    path: string;
    type: "file" | "folder";
    content?: string;
    children?: FileNode[];
    isOpen?: boolean;
};

// ─── Build tree from flat file list ─────────────────────────────────────────
function buildFileTree(files: File[]): FileNode[] {
    const root: FileNode[] = [];

    files.forEach((file) => {
        const parts = file.name.split("/");
        let currentLevel = root;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const existingNode = currentLevel.find((node) => node.name === part);

            if (existingNode) {
                if (isFile) {
                    existingNode.content = file.content;
                } else {
                    currentLevel = existingNode.children!;
                }
            } else {
                const newNode: FileNode = {
                    name: part,
                    path: parts.slice(0, index + 1).join("/"),
                    type: isFile ? "file" : "folder",
                    content: isFile ? file.content : undefined,
                    children: isFile ? undefined : [],
                    isOpen: true,
                };
                currentLevel.push(newNode);
                if (!isFile) {
                    currentLevel = newNode.children!;
                }
            }
        });
    });

    const sortNodes = (nodes: FileNode[]) => {
        nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === "folder" ? -1 : 1;
        });
        nodes.forEach((node) => {
            if (node.children) sortNodes(node.children);
        });
    };
    sortNodes(root);
    return root;
}

// ─── File icon color by extension ───────────────────────────────────────────
const getFileIconColor = (filename: string) => {
    if (filename.endsWith(".ts")) return "text-blue-400";
    if (filename.endsWith(".tsx")) return "text-blue-300";
    if (filename.endsWith(".js")) return "text-yellow-400";
    if (filename.endsWith(".jsx")) return "text-yellow-300";
    if (filename.endsWith(".css")) return "text-sky-300";
    if (filename.endsWith(".json")) return "text-yellow-200";
    if (filename.endsWith(".md")) return "text-gray-400";
    if (filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".svg")) return "text-green-400";
    return "text-gray-400";
};

// ─── Get file type label ────────────────────────────────────────────────────
const getFileTypeLabel = (filename: string) => {
    const ext = filename.split(".").pop() || "";
    const map: Record<string, string> = {
        ts: "TS", tsx: "TSX", js: "JS", jsx: "JSX",
        css: "CSS", json: "JSON", md: "MD", html: "HTML",
        png: "IMG", jpg: "IMG", svg: "SVG",
    };
    return map[ext] || ext.toUpperCase();
};

// ─── File Tree Item ─────────────────────────────────────────────────────────
const FileTreeItem = ({
    node,
    level,
    selectedFile,
    onSelect,
}: {
    node: FileNode;
    level: number;
    selectedFile: File | null;
    onSelect: (file: File) => void;
}) => {
    const [isOpen, setIsOpen] = useState(node.isOpen ?? false);

    const handleClick = () => {
        if (node.type === "folder") {
            setIsOpen(!isOpen);
        } else {
            onSelect({ name: node.path, content: node.content || "" });
        }
    };

    const isSelected = selectedFile?.name === node.path;

    return (
        <div>
            <button
                onClick={handleClick}
                className={`w-full flex items-center gap-1.5 px-2 py-[3px] select-none text-[13px] transition-colors text-left group
                    ${isSelected
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }
                `}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                {node.type === "folder" && (
                    <span className="shrink-0 text-gray-500 transition-transform duration-200">
                        {isOpen ? (
                            <ChevronDownIcon className="w-3 h-3" />
                        ) : (
                            <ChevronRightIcon className="w-3 h-3" />
                        )}
                    </span>
                )}
                {node.type === "file" && <span className="w-3 h-3 shrink-0" />}

                {node.type === "folder" ? (
                    <span className={`shrink-0 ${isOpen ? "text-gray-200" : "text-gray-400"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                        </svg>
                    </span>
                ) : (
                    <DocumentIcon className={`w-4 h-4 shrink-0 ${getFileIconColor(node.name)}`} />
                )}

                <span className="truncate flex-1">{node.name}</span>

                {/* Lock icon on files (v0-style read-only indicator) */}
                {node.type === "file" && (
                    <LockClosedIcon className="w-3 h-3 text-gray-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>

            {node.type === "folder" && isOpen && node.children && (
                <div className="border-l border-white/5 ml-[calc(11px+4px)]">
                    {node.children.map((child) => (
                        <FileTreeItem
                            key={child.path}
                            node={child}
                            level={level + 1}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Code with Line Numbers ─────────────────────────────────────────────────
function CodeWithLineNumbers({ code, language }: { code: string; language: string }) {
    const lines = code.split("\n");

    return (
        <div className="flex min-h-full font-mono text-[13px] leading-6">
            {/* Line numbers gutter */}
            <div className="select-none text-right pr-4 pl-4 py-4 text-gray-600 border-r border-white/5 flex-shrink-0 bg-[#0a0a10]">
                {lines.map((_, i) => (
                    <div key={i} className="leading-6">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Code content */}
            <div className="flex-1 overflow-x-auto">
                <CodeBlock
                    language={language}
                    code={code}
                    className="my-0 border-0 bg-transparent p-4 min-h-full text-[13px] leading-6"
                />
            </div>
        </div>
    );
}

// ─── Main CodeViewer ────────────────────────────────────────────────────────
export function CodeViewer({ files = [], messages }: CodeViewerProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [openTabs, setOpenTabs] = useState<File[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const fileTree = useMemo(() => buildFileTree(files), [files]);

    // Set initial selected file and first tab
    useEffect(() => {
        if (files && files.length > 0 && !selectedFile) {
            const entryPoint = files.find(
                (f) =>
                    f.name === "page.tsx" ||
                    f.name === "app/page.tsx" ||
                    f.name === "index.tsx" ||
                    f.name === "App.tsx" ||
                    f.name.endsWith("page.tsx")
            );
            const initial = entryPoint || files[0];
            setSelectedFile(initial);
            setOpenTabs([initial]);
        }
    }, [files, selectedFile]);

    // Open a file in the tab bar
    const handleFileSelect = useCallback(
        (file: File) => {
            setSelectedFile(file);
            setOpenTabs((prev) => {
                if (prev.some((t) => t.name === file.name)) return prev;
                return [...prev, file];
            });
        },
        []
    );

    // Close a tab
    const handleCloseTab = useCallback(
        (fileName: string, e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenTabs((prev) => {
                const filtered = prev.filter((t) => t.name !== fileName);
                // If closing the active tab, switch to adjacent
                if (selectedFile?.name === fileName && filtered.length > 0) {
                    setSelectedFile(filtered[filtered.length - 1]);
                } else if (filtered.length === 0) {
                    setSelectedFile(null);
                }
                return filtered;
            });
        },
        [selectedFile]
    );

    if (!files || files.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>No files generated yet.</p>
            </div>
        );
    }

    const currentFile = selectedFile || files[0];

    return (
        <div className="flex h-full bg-[#0d0d12] text-sm relative">
            {/* ── File Explorer Sidebar ── */}
            <div
                className={`${isSidebarOpen ? "w-56" : "w-0"
                    } border-r border-white/5 bg-[#0d0d12] flex flex-col font-sans transition-all duration-200 overflow-hidden shrink-0`}
            >
                {/* Sidebar Header */}
                <div className="h-9 flex items-center justify-between px-3 bg-[#0a0a10] border-b border-white/5 shrink-0">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        File Exp...
                    </span>
                    <div className="flex items-center gap-1">
                        <DocumentIcon className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
                        <FolderIcon className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
                        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors" />
                    </div>
                </div>

                {/* File Tree */}
                <div className="flex-1 overflow-y-auto pt-1 pb-2 custom-scrollbar">
                    {fileTree.map((node) => (
                        <FileTreeItem
                            key={node.path}
                            node={node}
                            level={0}
                            selectedFile={currentFile}
                            onSelect={handleFileSelect}
                        />
                    ))}
                </div>
            </div>

            {/* ── Main Code Area ── */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d12]">
                {/* File Tabs Bar */}
                <div className="h-9 border-b border-white/5 flex items-center bg-[#0a0a10] shrink-0 overflow-x-auto custom-scrollbar">
                    {/* Sidebar toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="px-2 h-full text-gray-500 hover:text-white hover:bg-white/5 transition-colors shrink-0 border-r border-white/5"
                        title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {isSidebarOpen ? (
                            <ChevronLeftIcon className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                        )}
                    </button>

                    {/* Tabs */}
                    {openTabs.map((tab) => {
                        const isActive = currentFile.name === tab.name;
                        const typeLabel = getFileTypeLabel(tab.name);
                        const baseName = tab.name.split("/").pop() || tab.name;

                        return (
                            <button
                                key={tab.name}
                                onClick={() => setSelectedFile(tab)}
                                className={`h-full flex items-center gap-1.5 px-3 text-[12px] shrink-0 border-r border-white/5 group transition-colors relative ${isActive
                                    ? "bg-[#0d0d12] text-gray-200"
                                    : "bg-[#08080d] text-gray-500 hover:text-gray-300 hover:bg-[#0a0a10]"
                                    }`}
                            >
                                {/* Active tab indicator */}
                                {isActive && (
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                )}

                                {/* File type badge */}
                                <span className={`text-[9px] font-bold px-1 py-[1px] rounded ${getFileIconColor(baseName).replace("text-", "bg-").replace("400", "500/20")
                                    } ${getFileIconColor(baseName)}`}>
                                    {typeLabel}
                                </span>

                                <span className="truncate max-w-[120px]">{baseName}</span>

                                {/* Lock icon */}
                                <LockClosedIcon className="w-3 h-3 text-gray-600 shrink-0" />

                                {/* Close button */}
                                <span
                                    onClick={(e) => handleCloseTab(tab.name, e)}
                                    className="ml-0.5 p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Filename bar (breadcrumb) */}
                <div className="h-7 border-b border-white/5 flex items-center gap-1.5 px-4 bg-[#0d0d12] shrink-0">
                    <DocumentIcon className={`w-3.5 h-3.5 ${getFileIconColor(currentFile.name)}`} />
                    <span className="text-[11px] text-gray-400 font-mono">
                        {currentFile.name}
                    </span>
                </div>

                {/* Code Editor with Line Numbers */}
                <div className="flex-1 overflow-auto custom-scrollbar relative">
                    {currentFile ? (
                        <CodeWithLineNumbers
                            code={currentFile.content}
                            language={currentFile.name.split(".").pop() || "tsx"}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            Select a file to view
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
