"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto";

// Verification of local password using Scrypt to avoid accidental state toggle
async function verifyUserPassword(password: string, userId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const response = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/auth/verify-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ password, user_id: userId }),
  });
  
  if (!response.ok) return false;
  const data = await response.json();
  return data.valid === true;
}

export async function toggleFacilityStateAction(formData: {
  facilityId: string;
  isEnabled: boolean;
  passwordConfirmation: string;
  userId: string;
}) {
  try {
    // 1. Password Guard Checks - physically blocks state mutations on failure
    const isPasswordCorrect = await verifyUserPassword(formData.passwordConfirmation, formData.userId);
    if (!isPasswordCorrect) {
      return { success: false, error: "Access Denied: Invalid password credentials." };
    }

    // 2. Execute Toggle Mutation
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    const response = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/portal/facilities/${formData.facilityId}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ is_enabled: formData.isEnabled }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return { success: false, error: errData.detail || "Database write failure." };
    }

    revalidatePath("/app/[institution]/[branch]/erp/settings");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Critical networking/system failure. Try again." };
  }
}
