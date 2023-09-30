"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { forwardRef } from "react";
import { Skill, Social } from "@prisma/client";
import { About } from "@/types/about";
import { Project } from "@/types/project";
import useFetch from "@/hooks/useFetch";

type Skills = {
  all: Skill[];
};

export function MyNavigationMenu() {
  const router = useRouter();

  const {
    data: skill,
    isLoading: isSkillLoading,
    error: skillError,
  } = useFetch<Skills>("/api/skill/");

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useFetch<User>("/api/");

  const {
    data: about,
    isLoading: isAboutLoading,
    error: aboutError,
  } = useFetch<About>("/api/about/");

  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useFetch<Project[]>("/api/project/");

  const {
    data: socials,
    isLoading: isSocialLoading,
    error: socialError,
  } = useFetch<Social[]>("/api/social/");

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
                  <p>City: {about?.Address.city}</p>
                  <p>State: {about?.Address.state}</p>
                </div>
              </ListItem>
              <ListItem title="Contact">
                {socials?.map((social) => (
                  <div key={social.id} className="space-x-2">
                    <a href={social.href}>
                      <img
                        className="h-6 w-6"
                        src={social.src}
                        alt={social.alt}
                      />
                    </a>
                  </div>
                ))}
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
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {skill?.all.map((component) => (
                <ListItem key={component.id} title={component.name}>
                  <div className="flex">
                    <img
                      src={component.src}
                      className="h-12 w-12 rounded-full"
                      alt={component.name}
                    />
                    <p className="flex items-center">{component.proficiency}</p>
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
