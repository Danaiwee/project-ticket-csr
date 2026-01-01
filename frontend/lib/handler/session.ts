export async function getSession(cookie: string): Promise<User | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user`,
      {
        method: "GET",
        headers: {
          Cookie: cookie,
          "Content-Type": "application/json",
        },
        // สำคัญ: ป้องกันไม่ให้ Next.js แคชข้อมูล User ข้ามคนกัน
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const result = await response.json();

    // สมมติว่า API ของคุณคืนค่าเป็น { success: true, data: { ...user } }
    // ต้องตรวจสอบโครงสร้างที่ Backend ส่งมาให้ดีครับ
    return result.data || result;
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
}
