"use client";

import useFetch from "@/hooks/useFetch";
import { Education } from "@prisma/client";

type Props = {};

const Education = (props: Props) => {
  const {
    data: education,
    isLoading,
    error,
  } = useFetch<Education[]>("/api/education/");

  return (
    <>
      <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
        Education
      </div>
      {isLoading && (
        <p className="flex items-center justify-center content-center">
          Loading...
        </p>
      )}
      {!isLoading && education?.length === 0 && (
        <p className="flex items-center justify-center content-center">
          No data found.
        </p>
      )}
      {!isLoading && error && (
        <p className="flex items-center justify-center content-center">
          Error occurred while fetching data.
        </p>
      )}
      {!isLoading && !error && education?.length !== 0 && (
        <div className="sm:px-0 px-4 p-4">
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 gap-10">
              {education?.map((edu) => {
                return (
                  <div
                    key={edu.id}
                    className="px-10 py-4 bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md rounded-lg"
                  >
                    <div className="text-3xl font-bold mb-2">{edu.school}</div>
                    <div className="text-xl mb-2 text-muted-foreground">
                      {edu.degree}
                    </div>
                    {edu.field ? (
                      <div className="text-lg mb-2 text-muted-foreground">
                        {edu.field}
                      </div>
                    ) : null}
                    <div className="text-md leading-tight text-muted-foreground">
                      {edu.startYear} - {edu.endYear}
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

export default Education;
