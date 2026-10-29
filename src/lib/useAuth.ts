"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const AUTH_STORAGE_KEY = "pingme-auth";
const SESSION_CACHE_KEY = "pingme-has-session";

export function useAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Instant synchronous check from client cache to prevent flash of wrong button
    if (typeof window !== "undefined") {
      const cached =
        localStorage.getItem(SESSION_CACHE_KEY) === "true" ||
        localStorage.getItem(AUTH_STORAGE_KEY) === "true";
      if (cached) {
        setIsLoggedIn(true);
      }
    }
    setMounted(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isConfigured =
      Boolean(supabaseUrl) &&
      !supabaseUrl?.includes("placeholder-project") &&
      !supabaseUrl?.includes("your-project-id");

    if (isConfigured) {
      try {
        const supabase = createClient();

        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            setUser(session.user);
            setIsLoggedIn(true);
            if (typeof window !== "undefined") {
              localStorage.setItem(SESSION_CACHE_KEY, "true");
            }
          } else {
            setUser(null);
            setIsLoggedIn(false);
            if (typeof window !== "undefined") {
              localStorage.removeItem(SESSION_CACHE_KEY);
              localStorage.removeItem(AUTH_STORAGE_KEY);
            }
          }
        });

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setUser(session.user);
            setIsLoggedIn(true);
            if (typeof window !== "undefined") {
              localStorage.setItem(SESSION_CACHE_KEY, "true");
            }
          } else {
            setUser(null);
            setIsLoggedIn(false);
            if (typeof window !== "undefined") {
              localStorage.removeItem(SESSION_CACHE_KEY);
              localStorage.removeItem(AUTH_STORAGE_KEY);
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch {
        const isAuthed =
          typeof window !== "undefined" &&
          (localStorage.getItem(SESSION_CACHE_KEY) === "true" ||
            localStorage.getItem(AUTH_STORAGE_KEY) === "true");
        setIsLoggedIn(isAuthed);
      }
    } else {
      const isAuthed =
        typeof window !== "undefined" &&
        (localStorage.getItem(SESSION_CACHE_KEY) === "true" ||
          localStorage.getItem(AUTH_STORAGE_KEY) === "true");
      setIsLoggedIn(isAuthed);
    }
  }, [pathname]);

  const login = useCallback(
    (redirectPath?: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_CACHE_KEY, "true");
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
      }
      setIsLoggedIn(true);
      if (redirectPath) {
        router.push(redirectPath);
      }
    },
    [router]
  );

  const logout = useCallback(
    async (redirectPath = "/") => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (
          Boolean(supabaseUrl) &&
          !supabaseUrl?.includes("placeholder-project")
        ) {
          const supabase = createClient();
          await supabase.auth.signOut();
        }
      } catch (err) {
        console.error("Signout error:", err);
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(SESSION_CACHE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setUser(null);
      setIsLoggedIn(false);
      router.push(redirectPath);
    },
    [router]
  );

  return {
    user,
    isLoggedIn,
    mounted,
    login,
    logout,
  };
}
