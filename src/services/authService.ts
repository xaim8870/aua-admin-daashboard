import { User, Role } from "@/types";
import { supabase } from "@/lib/supabase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

type LoginResult = {
  user: User;
  token: string;
};

export const authService = {
  login: async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session?.access_token || !data.user) {
      throw new Error(error?.message || "Login failed");
    }

    const token = data.session.access_token;

    // Ensure profile exists in backend
    await fetch(`${API_BASE_URL}/api/auth/bootstrap-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: data.user.user_metadata?.full_name || "AUA User",
      }),
    });

    // Read user/profile from backend
    const meResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const meResult = await meResponse.json();

    if (!meResponse.ok || !meResult.success) {
      throw new Error(meResult.message || "Failed to fetch user profile");
    }

    const profile = meResult.data.profile;

    return {
      token,
      user: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: profile.role as Role,
      },
    };
  },

  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async (token: string): Promise<User | null> => {
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return null;
    }

    const profile = result.data.profile;

    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      role: profile.role as Role,
    };
  },
};