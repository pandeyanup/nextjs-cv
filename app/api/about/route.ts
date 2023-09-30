import { db } from "@/lib/db";

export async function GET(req: Request) {
  const about = await db.user.findFirst({
    where: {
      name: "Anup Pandey",
    },
    select: {
      About: true,
      Address: true,
    },
  });
  return new Response(JSON.stringify(about), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
