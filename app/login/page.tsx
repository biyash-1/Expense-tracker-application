"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RingLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import useAuthStore from './../stores/authStore';

// Define interfaces for request and response data
interface LoginRequestData {
  email: string;
  password: string;
}

interface LoginResponseData {
  username: string;
  email: string;
  token: string;
  role: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  
  
  const login = useAuthStore(
    (state) => state.login
  );
  const url = "https://backend-yz2j.onrender.com";
  // const url = "http://localhost:3001";
  
  // Login function to make API call
  const loginFunction = async (data: LoginRequestData) => {
    const response = await axios.post<LoginResponseData>(`${url}/api/user/login`, data);
    return response.data; // Return response data
  };

  // Use mutation for handling login
  const mutation = useMutation({
    mutationFn: loginFunction,
    onSuccess: (data) => {
      const { username, email, token, role } = data;
      
      // Store token in localStorage
    
        localStorage.setItem("token", token);
 

      // Dispatch the login action
    login({ username, email, token ,role});

      // Redirect based on user role
      if (role === "admin") {
        router.push("/adminDashboardPage");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (err: any) => {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false); // Stop loading on error
      toast.error("Login failed. Please try again."); // Show error toast
    },
    onMutate: () => {
      setLoading(true); // Start loading when mutation starts
    },
    onSettled: () => {
      setLoading(false); // Stop loading when mutation is settled
    },
  });

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    // Trigger the mutation
    mutation.mutate({ email, password });
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear the error when user types
    setter(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && ( // Use loading state for the loader
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <RingLoader color="#36d68f" size={150} speedMultiplier={1.5} />
        </div>
      )}

      {!loading && (
        <Card className="w-80 h-[400px] rounded-xl border-blue-300 p-2">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <h1 className="p-1">Email</h1>
              <Input
                placeholder="Enter your email"
                aria-label="Email input"
                className="border-gray-500"
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </CardContent>
            <CardContent>
              <h1 className="p-1">Password</h1>
              <Input
                placeholder="Enter your password"
                aria-label="Password input"
                className="border-gray-500"
                type="password"
                value={password}
                onChange={handleInputChange(setPassword)}
              />
            </CardContent>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <CardFooter className="flex flex-col w-full gap-2 justify-center">
  <Button type="submit" className="w-full" disabled={loading}>
    {loading ? "Loading..." : "Login"}
  </Button>
  <Button
    type="button"
    className="w-full bg-gray-300 hover:bg-gray-400 text-black"
    onClick={() => {
      setEmail("guest@gmail.com");
      setPassword("12345");
      mutation.mutate({ email: "guest4@gmail.com", password: "0000" });
    }}
    disabled={loading}
  >
    {loading ? "Logging in as Guest..." : "Login as Guest"}
  </Button>
  <p className="text-center">
    Don&apos;t have an account?{" "}
    <a href="/signup" className="text-blue-500 hover:underline">
      Sign up
    </a>
  </p>
</CardFooter>

          </form>
        </Card>
      )}
    </div>
  );
};

export default Login;
