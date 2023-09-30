import { db } from "@/lib/db";

export async function GET(req: Request) {
  const skill = await db.user.findFirst({
    where: {
      name: "Anup Pandey",
    },
    select: {
      Skill: true,
    },
  });
  const skills = skill?.Skill.map((s) => s.name);
  return new Response(JSON.stringify({ all: skill?.Skill, skills: skills }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
