'use client';

import { useState } from 'react';
import { CircleMinus, CirclePlus, Circle, Folder, FolderOpen } from 'lucide-react';
import { TreeNodeData } from '@/lib/types/inerfaces';


// ─── Компоненты ───────────────────────────────────────────────────────────────

interface TreeViewProps {
    data: TreeNodeData[];
}

export const TreeView = ({ data }: TreeViewProps) => (
    <div className="space-y-1">
        {data.map(node => (
            <TreeNode key={node.id} node={node} depth={0} />
        ))}
    </div>
);

const TreeNode = ({ node, depth }: { node: TreeNodeData; depth: number }) => {
    const [isOpen, setIsOpen] = useState(depth === 0);
    const hasChildren = Boolean(node.children?.length);

    return (
        <div>
            <div
                className="flex items-center gap-1 py-1 px-2 hover:bg-blue-50 cursor-pointer rounded transition-colors"
                onClick={() => setIsOpen(prev => !prev)}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
                {/* Иконка раскрытия */}
                {hasChildren
                    ? (isOpen
                        ? <CircleMinus className="w-3 h-3 text-gray-400" />
                        : <CirclePlus className="w-3 h-3 text-gray-400" />)
                    : <Circle className="w-3 h-3 text-gray-400" />
                }

                {/* Иконка папки */}
                {hasChildren
                    ? (isOpen
                        ? <FolderOpen className="w-4 h-4 text-yellow-500" />
                        : <Folder className="w-4 h-4 text-yellow-500" />)
                    : <Folder className="w-4 h-4 text-yellow-500" />
                }

                <span className="text-xs text-gray-700 truncate">{node.title}</span>
            </div>

            {hasChildren && isOpen && (
                <div>
                    {node.children!.map(child => (
                        <TreeNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

