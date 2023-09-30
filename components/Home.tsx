"use client";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { User } from "@/types/user";
import Social from "./Social";
import RightClick from "./RightClick";
import { Skill } from "@prisma/client";
import useFetch from "@/hooks/useFetch";

type SkillAPIData = {
  all: Skill[];
  skills: string[];
};

const Home = () => {
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
        <div>
          <div className="flex justify-start py-12 px-12">
            <div className="flex items-center space-x-4">
              <RightClick>
                <img
                  src={user?.image}
                  className="h-32 w-32 rounded-full"
                  alt="user"
                />
              </RightClick>
              <div className="flex flex-col space-y-3">
                <p className="text-4xl font-bold">{user?.name}</p>
                <p className="text-sm leading-tight text-muted-foreground font-medium">
                  {user?.About.bio}
                </p>
                <p>
                  Skills: <span>{text}</span>
                  <Cursor cursorColor="green" />
                </p>
                <Social className="space-x-2" />
              </div>
            </div>
          </div>
          <div className="flex px-12"></div>
          <div className="flex px-6 text-justify pt-32">
            <p className="text-xl">{user?.About.about}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
