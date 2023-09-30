import { db } from "@/lib/db";

export async function GET(req: Request) {
  const allUsers = await db.user.findFirst({
    where: {
      name: "Anup Pandey",
    },
    include: {
      About: true,
      Address: true,
    },
  });
  return new Response(JSON.stringify(allUsers), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
