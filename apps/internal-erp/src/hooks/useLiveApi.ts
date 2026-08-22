// Location: apps/internal-erp/src/hooks/useLiveApi.ts
"use client";

import useSWR from "swr";

// Standard client-side Fetcher incorporating authorization credentials and multi-tenant scoping
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `API request failed with status: ${response.status}`);
  }

  return response.json();
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Hook to retrieve other non-faculty staff members
 */
export function useOtherStaff() {
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/portal/staff/other`,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000, // Prevent redundant calls within 5 seconds
    }
  );

  return {
    staff: data?.staff || [],
    totalCount: data?.total_count || 0,
    isLoading,
    isError: error,
    refetch: mutate,
  };
}

/**
 * Hook to retrieve academic faculty directory (Ustads)
 */
export function useFaculty() {
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/portal/staff/faculty`,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    faculty: data?.faculty || [],
    totalCount: data?.total_count || 0,
    isLoading,
    isError: error,
    refetch: mutate,
  };
}

/**
 * Hook to fetch deep operations and financial data for a specific branch center
 */
export function useCenterAnalytics(centerBranchId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    centerBranchId ? `${BASE_URL}/academics/center-metrics/${centerBranchId}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // Cache operational stats for 10 seconds
    }
  );

  return {
    analytics: data || null,
    isLoading,
    isError: error,
    refetch: mutate,
  };
}
