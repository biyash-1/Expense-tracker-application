"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login"); // Redirect to login if not authenticated
      } else {
        setIsAuthenticated(true); // Mark as authenticated once the token is validated
      }
    }, [router]);

    if (!isAuthenticated) return null; // Render nothing until authentication is checked

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
