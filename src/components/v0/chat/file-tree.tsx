"use client";

import React, { useMemo } from "react";
import { ChevronRightIcon, ChevronDownIcon, DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";

interface FileNode {
    name: string;
    path: string;
    type: "file" | "folder";
    children?: FileNode[];
}

interface FileTreeProps {
    files: Array<{ name: string; content?: string }>;
    selectedFile: string | null;
    onSelect: (path: string) => void;
}

export function FileTree({ files, selectedFile, onSelect }: FileTreeProps) {
    const tree = useMemo(() => {
        const root: FileNode[] = [];
        const map: Record<string, FileNode> = {};

        // Sort files to ensure consistency
        const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));

        sortedFiles.forEach((file) => {
            const parts = file.name.split("/");
            let currentPath = "";

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;
                const parentPath = currentPath;
                currentPath = currentPath ? `${currentPath}/${part}` : part;

                if (!map[currentPath]) {
                    const node: FileNode = {
                        name: part,
                        path: currentPath,
                        type: isFile ? "file" : "folder",
                        children: isFile ? undefined : [],
                    };
                    map[currentPath] = node;

                    if (index === 0) {
                        root.push(node);
                    } else {
                        const parent = map[parentPath];
                        if (parent && parent.children) {
                            // avoid duplicates in children array
                            if (!parent.children.find(child => child.path === node.path)) {
                                parent.children.push(node);
                            }
                        }
                    }
                }
            });
        });

        // Sort folders first, then files
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
    }, [files]);

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar text-[11px] font-bold text-slate-400 p-3">
            {tree.map((node) => (
                <TreeNode
                    key={node.path}
                    node={node}
                    selectedFile={selectedFile}
                    onSelect={onSelect}
                    level={0}
                />
            ))}
        </div>
    );
}

function TreeNode({
    node,
    selectedFile,
    onSelect,
    level,
}: {
    node: FileNode;
    selectedFile: string | null;
    onSelect: (path: string) => void;
    level: number;
}) {
    const [isOpen, setIsOpen] = React.useState(true); // Default all folders open
    const isSelected = node.type === "file" && node.path === selectedFile;

    const handleClick = () => {
        if (node.type === "folder") {
            setIsOpen(!isOpen);
        } else {
            onSelect(node.path);
        }
    };

    return (
        <div className="mb-0.5">
            <div
                className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all select-none group ${isSelected ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner" : "hover:bg-white/5 hover:text-slate-200 border border-transparent"
                    }`}
                style={{ paddingLeft: `${level * 12 + 12}px` }}
                onClick={handleClick}
            >
                {node.type === "folder" ? (
                    <span className="text-slate-600 group-hover:text-slate-400 transition-colors">
                        {isOpen ? (
                            <ChevronDownIcon className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                        )}
                    </span>
                ) : (
                    <span className="w-3.5" /> // Spacer
                )}

                {node.type === "folder" ? (
                    <FolderIcon className={`w-4 h-4 transition-colors ${isOpen ? "text-blue-500/80" : "text-slate-600"}`} />
                ) : (
                    <DocumentIcon className={`w-4 h-4 transition-colors ${isSelected ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"}`} />
                )}

                <span className="truncate uppercase tracking-wider">{node.name}</span>
            </div>

            {isOpen && node.children && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.path}
                            node={child}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
