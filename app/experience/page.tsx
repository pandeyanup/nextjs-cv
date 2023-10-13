"use client";

import { Loader2 } from "lucide-react";
import { trpc } from "../_trpc/client";

type Props = {};

const Experience = (props: Props) => {
  const {
    data: experiences,
    isLoading,
    error,
  } = trpc.getUserExperience.useQuery();
  return (
    <>
      <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
        Experience
      </div>
      {isLoading && (
        <p className="flex items-center justify-center content-center">
          <Loader2 className="h-4 w-4 animate-spin mr-4" /> Loading...
        </p>
      )}
      {!isLoading && experiences?.length === 0 && (
        <p className="flex items-center justify-center content-center">
          No data found.
        </p>
      )}
      {!isLoading && error && (
        <p className="flex items-center justify-center content-center">
          Error occurred while fetching data.
        </p>
      )}
      {!isLoading && !error && experiences?.length !== 0 && (
        <div className="sm:px-0 px-4 p-4">
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 gap-10">
              {experiences?.map((experience) => {
                return (
                  <div
                    key={experience.id}
                    className="px-10 py-4 bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md rounded-lg"
                  >
                    <div className="text-3xl font-bold mb-2">
                      {experience.company}
                    </div>
                    <div className="text-xl mb-2 text-muted-foreground">
                      {experience.position}
                    </div>

                    <div className="flex text-lg mb-2 text-muted-foreground w-auto">
                      <p>{experience.description}</p>
                    </div>

                    <div className="text-md leading-tight text-muted-foreground">
                      {experience.startYear} - {experience.endYear}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Experience;
