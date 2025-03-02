"use client";

import Link from "next/link";
import { useUser } from "@/lib/contexts";
import LoginDialog from "@/app/components/login-dialog";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useUser();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Get a reference to the dialog element after component mounts
  useEffect(() => {
    dialogRef.current = document.getElementById("login-dialog") as HTMLDialogElement;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  function handleOpenDialog(open: boolean) {
    if (!dialogRef.current) return;
    
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  } 

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 bg-white shadow-md dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Discourse<span className="text-indigo-600">Hub</span>
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {loading ? (
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <span className="font-medium text-indigo-800 dark:text-indigo-200">
                    {user.name ? user.name.charAt(0) : user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleOpenDialog(true)}
                className="inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        {children}
      </main>
      
      {/* Login Dialog */}
      <LoginDialog onClose={() => handleOpenDialog(false)} />
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} DiscourseHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
