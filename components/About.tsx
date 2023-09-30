"use client";

import { motion } from "framer-motion";
import useFetch from "@/hooks/useFetch";
import { About } from "@/types/about";
import { User } from "@/types/user";

type Props = {};

const About = (props: Props) => {
  const {
    data: about,
    isLoading: isAboutLoading,
    error: aboutError,
  } = useFetch<About>("/api/about/");

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useFetch<User>("/api/");

  return (
    <div className="snap-center">
      {isAboutLoading && isUserLoading && <p>Loading...</p>}
      {!isUserLoading && !isAboutLoading && about?.About.title.length === 0 && (
        <p>No data found.</p>
      )}
      {!isUserLoading && !isAboutLoading && aboutError && userError && (
        <p>Error occurred while fetching data.</p>
      )}
      {!isUserLoading && !isAboutLoading && !aboutError && !userError && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="h-[90vh] flex flex-col relative text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center"
        >
          <div className="absolute top-20 flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
            About
          </div>

          <motion.img
            initial={{
              x: -200,
              opacity: 0,
            }}
            transition={{
              duration: 1.2,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            // viewport={{ once: true }}
            className="-mb-64 md:mb-0 flex-shrink-0 w-56 h-56 rounded-full object-cover 5 xl:w-[500px] xl:h-[500px]"
            src={user?.image}
            alt="user"
          />
          <div className="space-y-10 px-0 md:px-10">
            <h4 className="text-4xl font-semi-bold">
              Here is a{" "}
              <span className="underline decoration-green-400">little</span>{" "}
              background
            </h4>
            <p className="text-sm text-justify">{about?.About.about}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default About;
