/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getSession(cookieStore: any): Promise<User | null> {
  try {
    console.log("Cookie in getSession", cookieStore);

    const allCookies = cookieStore
      .getAll()
      .map((c: any) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user`,
      {
        headers: {
          Cookie: allCookies,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
}
