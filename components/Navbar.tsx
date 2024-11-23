'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { ModeToggle } from '../components/Mode-toogle';
import { useRouter } from 'next/navigation';
import { FaBars } from 'react-icons/fa';
import { parseJwt } from '../app/utils/parseJwt';
import mylogo from '../app/assets/mylogo.png';
import Image from 'next/image';
import { RingLoader } from 'react-spinners';
import useAuthStore from './../app/stores/authStore';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side

  const {  isLoggedIn, login, logout } = useAuthStore();

  useEffect(() => {
    setIsClient(true); // Ensure client-side execution
    const token = localStorage.getItem('token');
  
    if (token) {
      const decodedToken = parseJwt(token); // Parse the token to get user info
      const isTokenValid = decodedToken && Date.now() < decodedToken.exp * 1000;
  
      if (isTokenValid) {
        // Log the user in if the token is valid
        login({
          username: decodedToken.username,
          email: decodedToken.email,
          token,
          role: decodedToken.role || 'user',
        });
      } else {
        localStorage.removeItem('token'); // Cleanup if invalid
        logout();
      }
    }
  }, [login, logout]);
  

  const handleLogout = async () => {
    try {
      setLoading(true); // Start loading
      localStorage.removeItem('token');
      logout(); // Use Zustand's logout function
      setTimeout(() => {
        router.push('/');
        setIsMenuOpen(false); // Close menu after logout
        setLoading(false); // Stop loading
      }, 2000); // 2 seconds delay
    } catch (error) {
      console.error('Logout Error:', error);
      setLoading(false); // Stop loading on error
    }
  };

  // Render nothing on the server side until the client-side flag is set
  if (!isClient) {
    return null;
  }

  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-900 shadow relative">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <RingLoader color="#36d68f" size={150} speedMultiplier={1.5} />
        </div>
      )}

      <nav className="flex justify-between items-center">
        <div className="text-2xl">
          <Image src={mylogo} alt="Logo" width={60} height={60} />
        </div>
        <ul className="hidden md:flex flex-grow justify-center gap-6 font-serif">
          <li className="hover:text-blue-500 transition-colors duration-300">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-blue-500 transition-colors duration-300">
            <Link href="/about">About</Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="hover:text-blue-500 transition-colors duration-300">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="hover:text-blue-500 transition-colors duration-300">
                <Link href="/transcationlogs">Transaction logs</Link>
              </li>
            </>
          )}
        </ul>
        <div className="hidden md:flex gap-2 p-2 mr-3">
          {!isLoggedIn ? (
            <>
              <Button variant="default" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button variant="default" onClick={() => router.push('/signup')}>
                Signup
              </Button>
            </>
          ) : (
            <Button variant="default" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
        <div className=" flex items-center">
          <ModeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className=" hover:text-blue-500 transition-colors duration-300">
            <FaBars className=" md:hidden w-6 h-6 text-white" />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <ul className="md:hidden flex flex-col items-center gap-4 mt-4">
          <li className="py-2 hover:text-blue-500 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
            <Link href="/">Home</Link>
          </li>
          <li className="py-2 hover:text-blue-500 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
            <Link href="/about">About</Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li className="py-2">
                <Button variant="default" onClick={() => { router.push('/login'); setIsMenuOpen(false); }}>Login</Button>
              </li>
              <li className="py-2">
                <Button variant="default" onClick={() => { router.push('/signup'); setIsMenuOpen(false); }}>Signup</Button>
              </li>
            </>
          ) : (
            <>
              <li className="py-2 hover:text-blue-500 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="py-2 hover:text-blue-500 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                <Link href="/transcationlogs">Transaction logs</Link>
              </li>
              <li className="py-2">
                <Button variant="default" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
