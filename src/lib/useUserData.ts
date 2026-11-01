"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/useAuth";

export interface UserVehicleData {
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

const STORAGE_KEY = "pingme-user-vehicle";

export const DEFAULT_USER_DATA: UserVehicleData = {
  plate: "K-123-XX",
  make: "Volkswagen",
  model: "Golf 8",
  color: "Zwart",
  token: "PM-NL-8924",
  channel: "whatsapp",
  phone: "+31 6 1234 5678",
  email: "klant@pingme.app",
  fullName: "",
  postalCode: "",
  houseNumber: "",
  street: "",
  city: "",
  address: "",
  paymentMethod: "ideal",
  selectedBank: "ING Bank",
  orderId: "PM-NL-892401",
  createdAt: "2026-10-29T10:00:00.000Z",
  durationYears: 2,
  expiresAt: "2028-10-29T10:00:00.000Z",
};

export function useUserData() {
  const { user } = useAuth();
  const [data, setData] = useState<UserVehicleData>(DEFAULT_USER_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData((prev) => ({
          ...prev,
          ...parsed,
          email: user?.email || parsed.email || prev.email,
        }));
      } else if (user?.email) {
        setData((prev) => ({
          ...prev,
          email: user.email!,
        }));
      }
    } catch (e) {
      console.error("Error reading stored user vehicle data:", e);
    } finally {
      setIsLoaded(true);
    }
  }, [user]);

  const updateData = useCallback((updates: Partial<UserVehicleData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error("Error saving user vehicle data:", e);
        }
      }
      return next;
    });
  }, []);

  return {
    data,
    isLoaded,
    updateData,
  };
}
