export async function getSession(cookie: string): Promise<User | null> {
  const authUser = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user`,
    {
      headers: {
        Cookie: cookie,
      },
      credentials: "include",
    }
  ).then((res) => res.json());

  return authUser;
}
