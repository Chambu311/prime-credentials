"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginDialog(props: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function signInWithGitHub() {
    setLoading(true);
    try {
      const supabase = createClient();
      const currentUrl = window.location.href;
      
      // Get the current domain (works in both development and production)
      const baseUrl = typeof window !== 'undefined' ? 
        `${window.location.protocol}//${window.location.host}` : 
        process.env.NEXT_PUBLIC_SITE_URL || 'https://your-production-domain.com';
      
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${baseUrl}/api/auth/callback?redirectUrl=${encodeURIComponent(currentUrl)}`,
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <dialog 
      id="login-dialog"
      className="p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full backdrop:bg-black/80 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0"
    >
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Use your GitHub account to continue
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={signInWithGitHub}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            {loading ? "Signing in..." : "Continue with GitHub"}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              props.onClose();
            }}
            className="text-sm font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
} 