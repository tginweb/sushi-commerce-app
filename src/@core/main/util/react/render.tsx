import React from "react";

export default function render<TProps>(
    com: React.ReactNode | Function | React.FC,
    props: TProps | {} = {},
    ctx: any = {}
): React.ReactNode {
    if (typeof com === 'function') {
        return com(props as any)
    } else {
        return com as any
    }
}
