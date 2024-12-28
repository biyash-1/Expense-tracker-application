import React, { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../stores/authStore";
import { parseJwt } from '../utils/parseJwt';
 

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>, adminRequired = false) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const token = useAuthStore(state => state.token);
    const role = useAuthStore(state => state.role);

    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      console.log("Logging in...", {token, role});

      if(!token) {
        router.push("/login");
        return;
      }

      try {
        const decodedToken = parseJwt(token);
        if(!decodedToken || decodedToken.exp < (Date.now() / 1000)) {
          router.push("/login");
          return;
        }

        if (adminRequired && role !== "admin") {
          router.push("/dashboard");
          return;
        }

        // setLoading(false);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    checkAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  

  return AuthComponent;
};

export default withAuth;
