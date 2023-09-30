import { db } from "@/lib/db";

export async function GET(req: Request) {
  const project = await db.user.findFirst({
    where: {
      name: "Kaito Sato",
    },
    select: {
      Project: true,
    },
  });
  return new Response(JSON.stringify(project?.Project), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
