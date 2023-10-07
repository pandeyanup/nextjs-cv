"use client";

import { trpc } from "@/app/_trpc/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Skill } from "@prisma/client";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";

type Skills = {
  all: Skill[];
};

export function MyNavigationMenu() {
  const router = useRouter();

  const {
    data: skill,
    isLoading: isSkillLoading,
    error: skillError,
  } = trpc.getUserSkills.useQuery();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = trpc.getMainUser.useQuery();

  const {
    data: about,
    isLoading: isAboutLoading,
    error: aboutError,
  } = trpc.getUserAbout.useQuery();

  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = trpc.getUserProjects.useQuery();

  const {
    data: socials,
    isLoading: isSocialLoading,
    error: socialError,
  } = trpc.getUserSocial.useQuery();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onClick={() => {
              router.push("/");
            }}
          >
            Intro
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <img
                      src={user?.image}
                      className="h-32 w-32 rounded-full"
                      alt="user"
                    />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {user?.name}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {user?.About.title}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem title="About">{about?.About.bio}</ListItem>
              <ListItem title="Address">
                <div>
                  <p>{about?.Address.city}</p>
                  <p>{about?.Address.state}</p>
                </div>
              </ListItem>
              <ListItem title="Contact">
                <ul className="grid space-x-2 pt-2 grid-cols-6">
                  {socials?.map((social) => (
                    <div key={social.id}>
                      <a href={social.href}>
                        <img
                          className="h-6 w-6"
                          src={social.src}
                          alt={social.alt}
                        />
                      </a>
                    </div>
                  ))}
                </ul>
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onClick={() => {
              router.push("/skill");
            }}
          >
            Skills
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] grid-cols-3 lg:w-[600px]">
              {skill?.all.map((component) => (
                <ListItem key={component.id} title={component.name}>
                  <div className="flex">
                    <img
                      src={component.src}
                      className="h-12 w-12 rounded-full"
                      alt={component.name}
                    />
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onClick={() => {
              router.push("/project");
            }}
          >
            Projects
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {project?.map((component) => (
                <ListItem
                  key={component.id}
                  title={component.name}
                  href={component.link}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
          <Link href="/experience" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Experience
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/education" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Education
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
