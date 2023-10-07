import { db } from "@/lib/db";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { LoginValidator } from "@/lib/validator/secret";

// query - mainly for getting data --GET
// mutation - mainly for changing data --POST, PATCH, DELETE

export const appRouter = router({
  getMainUser: publicProcedure.query(async () => {
    const allUsers = await db.user.findFirst({
      where: {
        name: "Anup Pandey",
      },
      include: {
        About: true,
        Address: true,
      },
    });

    if (!allUsers) throw new TRPCError({ code: "NOT_FOUND" });

    return allUsers;
  }),

  getUserAbout: publicProcedure.query(async () => {
    const about = await db.user.findFirst({
      where: {
        name: "Anup Pandey",
      },
      select: {
        About: true,
        Address: true,
      },
    });

    if (!about) throw new TRPCError({ code: "NOT_FOUND" });

    return about;
  }),

  getUserSkills: publicProcedure.query(async () => {
    const skill = await db.user.findFirst({
      where: {
        name: "Anup Pandey",
      },
      select: {
        Skill: true,
      },
    });

    if (!skill) throw new TRPCError({ code: "NOT_FOUND" });

    const skills = skill?.Skill.map((s) => s.name);
    return { all: skill?.Skill, skills: skills };
  }),

  getUserProjects: publicProcedure.query(async () => {
    const project = await db.user.findFirst({
      where: {
        name: "Anup Pandey",
      },
      select: {
        Project: true,
      },
    });

    if (!project) throw new TRPCError({ code: "NOT_FOUND" });

    return project?.Project;
  }),

  getUserEducation: publicProcedure.query(async () => {
    const education = await db.user.findFirst({
      where: {
        name: "Anup Pandey",
      },
      select: {
        Education: true,
      },
    });

    if (!education) throw new TRPCError({ code: "NOT_FOUND" });

    return education?.Education;
  }),

  getUserExperience: publicProcedure.query(async () => {
    const experience = await db.user.findFirst({
      where: {
        name: "Anup Pandey",
      },
      select: {
        WorkExperience: true,
      },
    });

    if (!experience) throw new TRPCError({ code: "NOT_FOUND" });

    return experience?.WorkExperience;
  }),

  getUserSocial: publicProcedure.query(async () => {
    const social = await db.user.findFirst({
      where: {
        name: "Anup Pandey",
      },
      select: {
        Social: true,
      },
    });

    if (!social) throw new TRPCError({ code: "NOT_FOUND" });

    return social?.Social;
  }),

  loginRequest: publicProcedure
    .input(LoginValidator)
    .mutation(async ({ input }) => {
      const emailValue = process.env["EMAIL"];
      const passwordValue = process.env["PASSWORD"];

      const { email, password } = input;

      if (!email || !password) {
        return "Please enter all data" as const;
      }

      if (password !== passwordValue || email !== emailValue) {
        throw new TRPCError({
          message: "Incorrect email or password entered.",
          code: "UNAUTHORIZED",
        });
      }

      if (password === passwordValue && email === emailValue) {
        return "Correct Secret Typed" as const;
      }

      return new TRPCError({
        message: "Incorrect email or password entered.",
        code: "UNAUTHORIZED",
      });
    }),
});

export type AppRouter = typeof appRouter;
