"use client";

import WithAuth from "../utils/withAuth";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const AuthenticatedComponent = WithAuth(() => <>{children}</>);

  return <AuthenticatedComponent />;
}
