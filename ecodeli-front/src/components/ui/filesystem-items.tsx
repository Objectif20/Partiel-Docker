"use client"

import { useState } from "react"
import { ChevronRight, Folder, File } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

type Node = {
    name: string;
    url?: string;
    nodes?: Node[];
};

interface FilesystemItemProps {
    node: Node;
    animated?: boolean;
    onFileClick?: (url: string) => void;
}

export function FilesystemItem({
    node,
    animated = false,
    onFileClick,
}: FilesystemItemProps) {
    let [isOpen, setIsOpen] = useState(false);

    const ChevronIcon = () =>
        animated ? (
            <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="flex"
            >
                <ChevronRight className="size-4 text-gray-500" />
            </motion.span>
        ) : (
            <ChevronRight
                className={`size-4 text-gray-500 ${isOpen ? "rotate-90" : ""}`}
            />
        );

    const ChildrenList = () => {
        const children = node.nodes?.map((node) => (
            <FilesystemItem
                node={node}
                key={node.name}
                animated={animated}
                onFileClick={onFileClick}
            />
        ));

        if (animated) {
            return (
                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="pl-6 overflow-hidden flex flex-col justify-end"
                        >
                            {children}
                        </motion.ul>
                    )}
                </AnimatePresence>
            );
        }
        return isOpen && <ul className="pl-6">{children}</ul>;
    };

    const handleToggleOpen = () => setIsOpen(!isOpen);

    return (
        <li key={node.name}>
            <span className="flex items-center gap-1.5 py-1">
                {node.nodes && node.nodes.length > 0 && (
                    <button onClick={handleToggleOpen} className="p-1 -m-1">
                        <ChevronIcon />
                    </button>
                )}

                {node.nodes ? (
                    <span
                        onClick={handleToggleOpen}
                        className="flex items-center gap-1.5 cursor-pointer"
                    >
                        <Folder
                            className="size-6 text-primary fill-primary"
                        />
                        {node.name}
                    </span>
                ) : (
                    <button
                        onClick={() => node.url && onFileClick && onFileClick(node.url)}
                        className="flex items-center"
                    >
                        <File className="ml-[22px] size-6 text-foreground" />
                        {node.name}
                    </button>
                )}
            </span>

            <ChildrenList />
        </li>
    );
}
