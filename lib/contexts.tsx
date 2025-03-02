"use client";

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthChangeEvent } from "@supabase/supabase-js";

// Define a simple User type
export type User = {
  email: string;
  name?: string;
};

// Create the context
export const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  signOut: async () => {},
});

// Create a provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to sign out
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  // Check for user on mount
  useEffect(() => {
    async function getUser() {
      setLoading(true);
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          email: session.user.email || "",
          name: session.user.user_metadata?.name,
        });
      }
      
      setLoading(false);
    }
    
    getUser();
    
    // Set up auth state change listener
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email || "",
            name: session.user.user_metadata?.name,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

// Create a hook to use the context
export function useUser() {
  return useContext(UserContext);
}
