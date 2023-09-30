"use client";

import useFetch from "@/hooks/useFetch";
import { About } from "@/types/about";

type Props = {};

const About = (props: Props) => {
  const { data: about, isLoading, error } = useFetch<About>("/api/about/");

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && about?.About.title.length === 0 && <p>No data found.</p>}
      {!isLoading && error && <p>Error occurred while fetching data.</p>}
      {!isLoading && !error && (
        <div>
          <div>
            <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
              About
            </div>
            {isLoading && <p>Loading...</p>}
            {!isLoading && error ? (
              <p>{error}</p>
            ) : (
              <div>
                <p>Title: {about?.About.title}</p>
                <p>Bio: {about?.About.bio}</p>
              </div>
            )}
          </div>
          <div>
            <p>Address</p>
            {isLoading && <p>Loading...</p>}
            {!isLoading && error ? (
              <p>{error}</p>
            ) : (
              <div>
                <p>City: {about?.Address.city}</p>
                <p>State: {about?.Address.state}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default About;
