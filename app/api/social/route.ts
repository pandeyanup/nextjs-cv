import { db } from "@/lib/db";

export async function GET(req: Request) {
  const social = await db.user.findFirst({
    where: {
      name: "Kaito Sato",
    },
    select: {
      Social: true,
    },
  });
  return new Response(JSON.stringify(social?.Social), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
