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
        <div className="w-full h-full overflow-y-auto custom-scrollbar text-sm text-gray-300 p-2">
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
        <div>
            <div
                className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors select-none ${isSelected ? "bg-indigo-500/20 text-indigo-300" : "hover:bg-white/5 hover:text-gray-200"
                    }`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={handleClick}
            >
                {node.type === "folder" ? (
                    <span className="text-gray-500">
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
                    <FolderIcon className="w-4 h-4 text-blue-400/70" />
                ) : (
                    <DocumentIcon className="w-4 h-4 text-gray-500" />
                )}

                <span className="truncate">{node.name}</span>
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
