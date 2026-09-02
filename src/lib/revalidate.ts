/**
 * Triggers On-Demand Revalidation for Next.js ISR cache
 */
export async function triggerRevalidation(params: {
  tag?: string;
  path?: string;
  secret?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        message: data.message || "Failed to trigger revalidation",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error triggering revalidation:", error);
    return {
      success: false,
      message: error.message || "Network error during revalidation",
    };
  }
}
