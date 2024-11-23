"use client";

import WithAuth from "../utils/withAuth";

export default function Layout({ children }: {children: ComponentType}) {
    return <WithAuth>{children}</WithAuth>
}