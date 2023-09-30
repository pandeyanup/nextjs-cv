"use client";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { User } from "@/types/user";
import { Skill } from "@prisma/client";
import useFetch from "@/hooks/useFetch";
import { motion } from "framer-motion";
import RightClick from "./RightClick";

type SkillAPIData = {
  all: Skill[];
  skills: string[];
};

type Props = {};

const Hero = (props: Props) => {
  const {
    data: skillAPIData,
    isLoading: isSkillLoading,
    error: skillError,
  } = useFetch<SkillAPIData>("/api/skill/");

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useFetch<User>("/api/");

  const [text, count] = useTypewriter({
    words: skillAPIData?.skills || [""],
    loop: true,
    delaySpeed: 2000,
  });

  return (
    <>
      {isSkillLoading && isUserLoading && <p>Loading...</p>}
      {!isSkillLoading && !isUserLoading && user?.name.length === 0 && (
        <p>No data found.</p>
      )}
      {!isSkillLoading && !isUserLoading && (skillError || userError) && (
        <p>Error occurred while fetching data.</p>
      )}
      {!isSkillLoading && !isUserLoading && !skillError && !userError && (
        <div className="flex flex-col">
          <div className="flex snap-y snap-mandatory z-0">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex h-[95vh] flex-col items-center justify-center content-center space-y-8 text-center overflow-hidden"
            >
              <RightClick>
                <img
                  className="relative rounded-full h-64 w-64 mx-auto object-cover"
                  src={user?.image}
                  alt="user"
                />
              </RightClick>
              <div className="z-20">
                <h2 className="text-5xl lg:text-6xl font-semibold px-10 uppercasepb-2 tracking-[10px]">
                  {user?.name}
                </h2>
                <h2 className="text-sm uppercase pb-2 tracking-[8px]">
                  {user?.About.bio}
                </h2>
                <h1 className="text-4xl lg:text-5xl px-10">
                  <span className="mr-3 ">
                    {text}
                    <Cursor cursorColor="green" />
                  </span>
                </h1>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 px-6 text-justify pt-32"
            >
              <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
                About
              </div>
              <p className="text-xl pr-4 -ml-9">{user?.About.about}</p>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
