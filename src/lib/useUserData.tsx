"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/useAuth";
import { createClient } from "@/lib/supabase/client";

export interface UserVehicleData {
  id?: string;
  plate: string;
  make: string;
  model: string;
  color: string;
  token: string;
  channel: "whatsapp" | "sms" | "email";
  phone: string;
  email: string;
  fullName: string;
  postalCode: string;
  houseNumber: string;
  addition?: string;
  street: string;
  city: string;
  address: string;
  paymentMethod?: string;
  selectedBank?: string;
  orderId?: string;
  createdAt?: string;
  durationYears?: number;
  expiresAt?: string;
}

const STORAGE_KEY_MULTI = "pingme-user-vehicles";
const STORAGE_KEY_SINGLE = "pingme-user-vehicle";
const ACTIVE_INDEX_KEY = "pingme-active-vehicle-index";

export const DEFAULT_USER_DATA: UserVehicleData = {
  id: "veh-demo-1",
  plate: "K-123-XX",
  make: "Volkswagen",
  model: "Golf 8",
  color: "Zwart",
  token: "PM-NL-8924",
  channel: "whatsapp",
  phone: "+31 6 1234 5678",
  email: "",
  fullName: "Abdelrhman Adel",
  postalCode: "1016 GD",
  houseNumber: "482",
  street: "Keizersgracht",
  city: "Amsterdam",
  address: "Keizersgracht 482, 1016 GD Amsterdam",
  paymentMethod: "ideal",
  selectedBank: "ING Bank",
  orderId: "PM-NL-892401",
  createdAt: "2026-10-29T10:00:00.000Z",
  durationYears: 2,
  expiresAt: "2028-10-29T10:00:00.000Z",
};

export const DEFAULT_USER_VEHICLES: UserVehicleData[] = [
  DEFAULT_USER_DATA,
  {
    id: "veh-demo-2",
    plate: "T-456-YY",
    make: "Tesla",
    model: "Model 3",
    color: "Parelmoer Wit",
    token: "PM-NL-9102",
    channel: "sms",
    phone: "+31 6 8765 4321",
    email: "",
    fullName: "Abdelrhman Adel",
    postalCode: "1016 GD",
    houseNumber: "482",
    street: "Keizersgracht",
    city: "Amsterdam",
    address: "Keizersgracht 482, 1016 GD Amsterdam",
    paymentMethod: "apple_pay",
    selectedBank: "Apple Pay",
    orderId: "PM-NL-910202",
    createdAt: "2026-11-01T12:00:00.000Z",
    durationYears: 3,
    expiresAt: "2029-11-01T12:00:00.000Z",
  },
];

export interface UserDataContextType {
  vehicles: UserVehicleData[];
  activeVehicle: UserVehicleData;
  data: UserVehicleData;
  activeVehicleIndex: number;
  setActiveVehicleIndex: (index: number) => void;
  updateActiveVehicle: (updates: Partial<UserVehicleData>) => void;
  updateData: (updates: Partial<UserVehicleData>) => void;
  addVehicle: (newVehicle: UserVehicleData) => void;
  isLoaded: boolean;
}

const UserDataContext = createContext<UserDataContextType | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<UserVehicleData[]>(DEFAULT_USER_VEHICLES);
  const [activeVehicleIndex, setActiveVehicleIndexState] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load vehicles from Supabase or LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isSubscribed = true;

    async function loadData() {
      // 1. Try to load from Supabase if authenticated and configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (
        user?.id &&
        supabaseUrl &&
        !supabaseUrl.includes("placeholder")
      ) {
        try {
          const supabase = createClient();
          const { data: dbVehicles, error } = await supabase
            .from("vehicles")
            .select(`
              id,
              license_plate,
              make_model,
              color,
              duration_years,
              expires_at,
              created_at,
              tags (
                id,
                token,
                channel,
                destination_phone,
                destination_email,
                status
              )
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && dbVehicles && dbVehicles.length > 0 && isSubscribed) {
            const mappedVehicles: UserVehicleData[] = dbVehicles.map((v: any, idx: number) => {
              const tag = Array.isArray(v.tags) && v.tags.length > 0 ? v.tags[0] : null;
              const [make = "Auto", ...modelParts] = (v.make_model || "").split(" ");
              return {
                id: v.id,
                plate: v.license_plate || "Onbekend",
                make: make || "Auto",
                model: modelParts.join(" ") || "",
                color: v.color || "Onbekend",
                token: tag?.token || `PM-NL-${v.id?.slice(0, 4) || "0000"}`,
                channel: tag?.channel || "whatsapp",
                phone: tag?.destination_phone || "+31 6 ",
                email: tag?.destination_email || user.email || "",
                fullName: user.user_metadata?.full_name || "",
                postalCode: "",
                houseNumber: "",
                street: "",
                city: "",
                address: "",
                createdAt: v.created_at,
                durationYears: v.duration_years || 2,
                expiresAt: v.expires_at,
                orderId: `PM-NL-${idx + 1}`,
              };
            });

            setVehicles(mappedVehicles);
            setIsLoaded(true);
            return;
          }
        } catch (supabaseErr) {
          console.warn("Could not fetch user vehicles from Supabase, falling back to local storage:", supabaseErr);
        }
      }

      // 2. Fallback to LocalStorage
      try {
        const storedMulti = localStorage.getItem(STORAGE_KEY_MULTI);
        const storedSingle = localStorage.getItem(STORAGE_KEY_SINGLE);
        const storedIndex = localStorage.getItem(ACTIVE_INDEX_KEY);
        const activeEmail =
          user?.email ||
          (typeof window !== "undefined" ? localStorage.getItem("pingme-user-email") : null) ||
          "";

        const patchVehicles = (list: UserVehicleData[]) => {
          return list.map((v) => ({
            ...v,
            email: !v.email || v.email === "klant@pingme.app" ? activeEmail : v.email,
          }));
        };

        if (storedMulti) {
          const parsed = JSON.parse(storedMulti);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVehicles(patchVehicles(parsed));
          }
        } else if (storedSingle) {
          const parsedSingle = JSON.parse(storedSingle);
          if (parsedSingle && typeof parsedSingle === "object") {
            // Keep the single user vehicle and preserve demo vehicles for testing
            const merged = patchVehicles([
              parsedSingle,
              DEFAULT_USER_VEHICLES[1] // Tesla Model 3
            ]);
            setVehicles(merged);
            localStorage.setItem(STORAGE_KEY_MULTI, JSON.stringify(merged));
          }
        } else {
          const defaults = patchVehicles(DEFAULT_USER_VEHICLES);
          setVehicles(defaults);
          localStorage.setItem(STORAGE_KEY_MULTI, JSON.stringify(defaults));
        }

        if (storedIndex) {
          const idx = parseInt(storedIndex, 10);
          if (!isNaN(idx)) {
            setActiveVehicleIndexState(idx);
          }
        }
      } catch (err) {
        console.error("Error reading stored vehicle data:", err);
      } finally {
        if (isSubscribed) setIsLoaded(true);
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  // Persist multi-vehicle state changes
  const persistVehicles = useCallback((newVehicles: UserVehicleData[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_MULTI, JSON.stringify(newVehicles));
      if (newVehicles.length > 0) {
        localStorage.setItem(STORAGE_KEY_SINGLE, JSON.stringify(newVehicles[0]));
      }
    } catch (e) {
      console.error("Failed to save vehicles to localStorage:", e);
    }
  }, []);

  const setActiveVehicleIndex = useCallback((index: number) => {
    setActiveVehicleIndexState(index);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ACTIVE_INDEX_KEY, index.toString());
      } catch (e) {
        console.error("Failed to save active vehicle index:", e);
      }
    }
  }, []);

  // Update current active vehicle
  const updateActiveVehicle = useCallback(
    (updates: Partial<UserVehicleData>) => {
      setVehicles((prev) => {
        const safeIdx = Math.min(Math.max(0, activeVehicleIndex), prev.length - 1);
        const current = prev[safeIdx] || DEFAULT_USER_DATA;
        const updatedVehicle = { ...current, ...updates };

        const next = [...prev];
        next[safeIdx] = updatedVehicle;
        persistVehicles(next);
        return next;
      });
    },
    [activeVehicleIndex, persistVehicles]
  );

  // Add a new vehicle to the user's account
  const addVehicle = useCallback(
    (newVehicle: UserVehicleData) => {
      setVehicles((prev) => {
        const next = [...prev, newVehicle];
        persistVehicles(next);
        setActiveVehicleIndex(next.length - 1);
        return next;
      });
    },
    [persistVehicles, setActiveVehicleIndex]
  );

  const safeIndex = Math.min(Math.max(0, activeVehicleIndex), vehicles.length - 1);
  const activeVehicle = vehicles[safeIndex] || DEFAULT_USER_DATA;

  const value = useMemo<UserDataContextType>(() => ({
    vehicles,
    activeVehicle,
    data: activeVehicle,
    activeVehicleIndex: safeIndex,
    setActiveVehicleIndex,
    updateActiveVehicle,
    updateData: updateActiveVehicle,
    addVehicle,
    isLoaded,
  }), [vehicles, activeVehicle, safeIndex, setActiveVehicleIndex, updateActiveVehicle, addVehicle, isLoaded]);

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData(): UserDataContextType {
  const context = useContext(UserDataContext);
  if (!context) {
    // Graceful fallback if called outside provider (e.g. isolated SSR or unit tests)
    return {
      vehicles: DEFAULT_USER_VEHICLES,
      activeVehicle: DEFAULT_USER_DATA,
      data: DEFAULT_USER_DATA,
      activeVehicleIndex: 0,
      setActiveVehicleIndex: () => {},
      updateActiveVehicle: () => {},
      updateData: () => {},
      addVehicle: () => {},
      isLoaded: true,
    };
  }
  return context;
}
