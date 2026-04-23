import { Lead } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("aua_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const leadsService = {
  getLeads: async (): Promise<Lead[]> => {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch leads");
    }

    return result.data;
  },

  getLeadById: async (id: string): Promise<Lead | null> => {
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (response.status === 404) {
      return null;
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch lead");
    }

    return result.data;
  },

  updateLeadStatus: async (id: string, status: Lead["status"]): Promise<Lead> => {
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update lead status");
    }

    return result.data;
  },
};