"use client";

import { CopyButton as MantineCopyButton, Tooltip, UnstyledButton } from "@mantine/core";
import { type ReactNode } from "react";

interface CopyButtonProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export function CopyButton({ value, children, className }: CopyButtonProps) {
    return (
        <MantineCopyButton value={value}>
            {({ copied, copy }) => (
                <Tooltip
                    color={copied ? "green" : undefined}
                    label={copied ? "Copied to clipboard" : "Click to copy"}
                    openDelay={1000}
                    withinPortal
                >
                    <UnstyledButton
                        className={className}
                        onClick={(e) => {
                            e.stopPropagation();
                            copy();
                        }}
                        role="presentation"
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            color: "inherit",
                            cursor: "copy",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            fontWeight: "inherit",
                            justifyContent: "inherit",
                            letterSpacing: "inherit",
                            margin: "-4px",
                            minWidth: "unset",
                            padding: "4px",
                            textAlign: "inherit",
                            textTransform: "inherit",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            if (!copied) {
                                e.currentTarget.style.backgroundColor =
                                    "var(--mantine-color-indigo-1)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = "translateY(1px)";
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        {children}
                    </UnstyledButton>
                </Tooltip>
            )}
        </MantineCopyButton>
    );
}

