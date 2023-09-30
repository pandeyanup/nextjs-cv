import { db } from "@/lib/db";

export async function GET(req: Request) {
  const education = await db.user.findFirst({
    where: {
      name: "Anup Pandey",
    },
    select: {
      Education: true,
    },
  });
  return new Response(JSON.stringify(education?.Education), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
