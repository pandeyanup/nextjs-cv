import { db } from "@/lib/db";
import { LoginValidator } from "@/lib/validator/secret";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";

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

    return education?.Education.sort((a, b) => {
      return Number(b.startYear) - Number(a.startYear);
    });
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
      const { email, password } = input;

      if (!email || !password) {
        return "Please enter all data" as const;
      }

      const emailCheck = await db.account.findFirst({
        where: {
          email: email,
        },
      });

      if (!emailCheck) {
        throw new TRPCError({
          message: "Incorrect email or password entered.",
          code: "UNAUTHORIZED",
        });
      }
      console.log(emailCheck);

      return new TRPCError({
        message: "Incorrect email or password entered.",
        code: "UNAUTHORIZED",
      });
    }),

  //CREATE
  // TODO: Add middleware to check if the user is logged in
  addSkill: privateProcedure
    .input(
      z.object({
        name: z.string(),
        src: z.string(),
        proficiency: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const skill = await db.skill.create({
          data: {
            name: input.name,
            src: input.src,
            proficiency: input.proficiency,
            userId: input.userId,
          },
        });

        if (!skill) {
          throw new TRPCError({
            code: "TIMEOUT",
            message: "Server timed out. Please try again.",
          });
        }

        return skill;
      } catch (err: any) {
        if (err.code === "UNAUTHORIZED") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create skill",
        });
      }
    }),

  addSocial: privateProcedure
    .input(
      z.object({
        href: z.string().url(),
        src: z.string().url(),
        alt: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const social = await db.social.create({
          data: {
            alt: input.alt,
            href: input.href,
            src: input.src,
            userId: input.userId,
          },
        });

        if (!social) {
          throw new TRPCError({
            code: "TIMEOUT",
            message: "Server timed out. Please try again.",
          });
        }

        return social;
      } catch (err: any) {
        if (err.code === "UNAUTHORIZED") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update social data",
        });
      }
    }),

  addProject: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        link: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const project = await db.project.create({
          data: {
            name: input.name,
            description: input.description,
            link: input.link,
            userId: input.userId,
          },
        });

        if (!project) {
          throw new TRPCError({
            code: "TIMEOUT",
            message: "Server timed out. Please try again.",
          });
        }

        return project;
      } catch (err: any) {
        if (err.code === "UNAUTHORIZED") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update project data",
        });
      }
    }),

  addExperience: privateProcedure
    .input(
      z.object({
        company: z.string(),
        position: z.string(),
        startYear: z.string(),
        endYear: z.string(),
        description: z.string().nullable(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const experience = await db.workExperience.create({
          data: {
            company: input.company,
            description: input.description,
            endYear: input.endYear,
            position: input.position,
            startYear: input.startYear,
            userId: input.userId,
          },
        });

        if (!experience) {
          throw new TRPCError({
            code: "TIMEOUT",
            message: "Server timed out. Please try again.",
          });
        }

        return experience;
      } catch (err: any) {
        if (err.code === "UNAUTHORIZED") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update experience data",
        });
      }
    }),

  addEducation: privateProcedure
    .input(
      z.object({
        school: z.string(),
        degree: z.string(),
        field: z.string().nullable(),
        startYear: z.string(),
        endYear: z.string(),
        description: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const education = await db.education.create({
          data: {
            school: input.school,
            degree: input.degree,
            field: input.field,
            startYear: input.startYear,
            endYear: input.endYear,
            description: input.description,
            userId: input.userId,
          },
        });

        if (!education) {
          throw new TRPCError({
            code: "TIMEOUT",
            message: "Server timed out. Please try again.",
          });
        }

        return education;
      } catch (err: any) {
        if (err.code === "UNAUTHORIZED") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update education data",
        });
      }
    }),

  // DELETE PART
  // TODO: Add middleware to check if user is logged in
  deleteSocial: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const social = await db.social.delete({
          where: {
            id: input.id,
          },
        });

        if (!social) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Social data with that ID not found",
          });
        }

        return social;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update social data.",
        });
      }
    }),

  deleteSkill: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const skill = await db.skill.delete({
          where: {
            id: input.id,
          },
        });

        if (!skill) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Skill data with that ID not found",
          });
        }

        return skill;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update skill data.",
        });
      }
    }),

  deleteProject: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const project = await db.project.delete({
          where: {
            id: input.id,
          },
        });

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project data with that ID not found",
          });
        }

        return project;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update project data.",
        });
      }
    }),

  deleteExperience: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const experience = await db.workExperience.delete({
          where: {
            id: input.id,
          },
        });

        if (!experience) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Experience data with that ID not found",
          });
        }

        return experience;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update experience data.",
        });
      }
    }),

  deleteEducation: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const education = await db.education.delete({
          where: {
            id: input.id,
          },
        });

        if (!education) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Education data with that ID not found",
          });
        }

        return education;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update education data.",
        });
      }
    }),

  // EDIT PART
  // TODO: Add middleware to check if user is logged in
  editSocial: privateProcedure
    .input(
      z.object({
        id: z.string(),
        href: z.string().url(),
        src: z.string().url(),
        alt: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const social = await db.social.update({
          where: {
            id: input.id,
          },
          data: {
            alt: input.alt,
            href: input.href,
            src: input.src,
          },
        });

        if (!social) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Social data with that ID not found",
          });
        }

        return social;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update social data",
        });
      }
    }),

  editAbout: privateProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        about: z.string(),
        bio: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const aboutData = await db.about.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            about: input.about,
            bio: input.bio,
          },
        });

        if (!aboutData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "About data with that ID not found",
          });
        }

        return aboutData;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update about data",
        });
      }
    }),

  editSkill: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        src: z.string(),
        proficiency: z.string(),
        // userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const skill = await db.skill.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            src: input.src,
            proficiency: input.proficiency,
            // userId: input.userId,
          },
        });

        if (!skill) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Skill data with that ID not found",
          });
        }

        return skill;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update skill data",
        });
      }
    }),

  editProject: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        link: z.string(),
        // userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const project = await db.project.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            link: input.link,
            // userId: input.userId,
          },
        });

        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project data with that ID not found",
          });
        }

        return project;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update project data",
        });
      }
    }),

  editExperience: privateProcedure
    .input(
      z.object({
        id: z.string(),
        company: z.string(),
        position: z.string(),
        startYear: z.string(),
        endYear: z.string(),
        description: z.string().nullable(),
        // userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const experience = await db.workExperience.update({
          where: {
            id: input.id,
          },
          data: {
            company: input.company,
            description: input.description,
            endYear: input.endYear,
            position: input.position,
            startYear: input.startYear,
            // userId: input.userId,
          },
        });

        if (!experience) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Experience data with that ID not found",
          });
        }

        return experience;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update experience data",
        });
      }
    }),

  editEducation: privateProcedure
    .input(
      z.object({
        id: z.string(),
        school: z.string(),
        degree: z.string(),
        field: z.string().nullable(),
        startYear: z.string(),
        endYear: z.string(),
        description: z.string(),
        // userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const education = await db.education.update({
          where: {
            id: input.id,
          },
          data: {
            school: input.school,
            degree: input.degree,
            field: input.field,
            startYear: input.startYear,
            endYear: input.endYear,
            description: input.description,
            // userId: input.userId,
          },
        });

        if (!education) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Education data with that ID not found",
          });
        }

        return education;
      } catch (err: any) {
        if (err.code === "NOT_FOUND") {
          throw err;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update education data",
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
