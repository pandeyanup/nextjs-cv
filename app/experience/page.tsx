"use client";

import useFetch from "@/hooks/useFetch";
import { WorkExperience } from "@prisma/client";

type Props = {};

const Experience = (props: Props) => {
  const {
    data: experiences,
    isLoading,
    error,
  } = useFetch<WorkExperience[]>("/api/experience/");
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && experiences?.length === 0 && <p>No data found.</p>}
      {!isLoading && error && <p>Error occurred while fetching data.</p>}
      {!isLoading && !error && (
        <div className="sm:px-0 px-4 p-4">
          <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
            Projects
          </div>
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 gap-10">
              {experiences?.map((experience) => (
                <div
                  key={experience.id}
                  className="px-10 py-4 bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md rounded-lg"
                >
                  <p className="text-3xl font-bold mb-2">
                    {experience.company}
                  </p>
                  <p className="text-xl mb-2">{experience.position}</p>
                  <p className="text-lg mb-2 leading-tight text-muted-foreground">
                    {experience.startYear}-{experience.endYear}
                  </p>
                  <p className="leading-tight text-muted-foreground">
                    {experience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
