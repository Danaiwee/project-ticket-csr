export async function getSession(cookie: string): Promise<User | null> {
  try {
    console.log("cookie in getSession", cookie);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user`,
      {
        headers: { Cookie: cookie },
        credentials: "include",
      }
    );

    if (!response.ok) return null; // ถ้า 401 หรือ 500 ให้คืน null

    const authUser = await response.json();

    return authUser;
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
}
