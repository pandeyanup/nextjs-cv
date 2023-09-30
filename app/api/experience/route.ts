import { db } from "@/lib/db";

export async function GET(req: Request) {
  const experience = await db.user.findFirst({
    where: {
      name: "Anup Pandey",
    },
    select: {
      WorkExperience: true,
    },
  });
  return new Response(JSON.stringify(experience?.WorkExperience), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
