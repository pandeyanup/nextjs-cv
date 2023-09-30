"use client";

import useFetch from "@/hooks/useFetch";
import { Project } from "@/types/project";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {};

const Project = (props: Props) => {
  const {
    data: project,
    isLoading,
    error,
  } = useFetch<Project[]>("/api/project/");
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && project?.length === 0 && <p>No data found.</p>}
      {!isLoading && error && <p>Error occurred while fetching data.</p>}
      {!isLoading && !error && (
        <div className="sm:px-0 px-4 p-4">
          <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
            Projects
          </div>
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 gap-10">
              {project?.map((p) => (
                <div
                  key={p.id}
                  className="px-10 py-4 bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md rounded-lg"
                >
                  <div className="text-3xl font-bold mb-2">{p.name}</div>
                  <div className="text-xl mb-2 text-muted-foreground">
                    {p.description}
                  </div>
                  <div className="text-lg mb-2 text-muted-foreground">
                    <Link href={p.link}>{p.link}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
