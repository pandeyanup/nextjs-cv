"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { trpc } from "../_trpc/client";

type Props = {};

const Project = (props: Props) => {
  const { data: project, isLoading, error } = trpc.getUserProjects.useQuery();

  return (
    <>
      <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
        Projects
      </div>
      {isLoading && (
        <p className="flex items-center justify-center content-center">
          <Loader2 className="h-4 w-4 animate-spin mr-4" /> Loading...
        </p>
      )}
      {!isLoading && project?.length === 0 && (
        <p className="flex items-center justify-center content-center">
          No data found.
        </p>
      )}
      {!isLoading && error ? (
        <p className="flex items-center justify-center content-center">
          Error occurred while fetching data.
        </p>
      ) : null}
      {!isLoading && !error && project?.length !== 0 && (
        <div className="sm:px-0 px-4 p-4">
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
    </>
  );
};

export default Project;
