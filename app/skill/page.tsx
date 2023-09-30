"use client";

import useFetch from "@/hooks/useFetch";
import { Skill } from "@prisma/client";

type Skills = {
  all: Skill[];
};

const Skill = () => {
  const { data: skill, isLoading, error } = useFetch<Skills>("/api/skill/");
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && skill?.all.length === 0 && <p>No data found.</p>}
      {!isLoading && error && <p>Error occurred while fetching data.</p>}
      {!isLoading && !error && (
        <div className="sm:px-0 px-4 p-4">
          <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
            Skills
          </div>
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-4 gap-5">
              {skill?.all.map((s) => {
                return (
                  <div
                    key={s.id}
                    className="px-10 py-4 outline-none focus:shadow-md rounded-lg"
                  >
                    <div className="group relative flex flex-col items-center cursor-pointer">
                      <img
                        className="border border-gray-500 w-24 h-24 md:h-28 md:w-28 xl:h-32 xl:w-32 rounded-full object-cover filter group-hover:grayscale transition duration-300 ease-in-out"
                        src={s.src}
                        alt={s.name}
                      />
                      <div className="absolute opacity-0 group-hover:opacity-60 transition duration-300 ease-in-out group-hover:bg-white h-24 w-24 md:h-28 md:w-28 xl:h-32 xl:w-32 rounded-full z-0">
                        <div className="flex items-center justify-center h-full">
                          <p className="text-3xl font-bold text-green-500 opacity-100">
                            {s.proficiency}
                          </p>
                        </div>
                      </div>
                      <p className="text-center">{s.name}</p>
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

export default Skill;
