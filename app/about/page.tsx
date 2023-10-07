"use client";

import { Loader2 } from "lucide-react";
import { trpc } from "../_trpc/client";

type Props = {};

const page = (props: Props) => {
  const { data: about, isLoading, error } = trpc.getUserAbout.useQuery();

  return (
    <>
      <div className="flex justify-center items-center uppercase tracking-[12px] mb-10 text-3xl font-bold">
        About
      </div>
      {isLoading && (
        <p className="flex items-center justify-center content-center">
          <Loader2 className="h-4 w-4 animate-spin mr-4" /> Loading...
        </p>
      )}
      {!isLoading && about?.About.title.length === 0 && (
        <p className="flex items-center justify-center content-center">
          No data found.
        </p>
      )}
      {!isLoading && error && (
        <p className="flex items-center justify-center content-center">
          Error occurred while fetching data.
        </p>
      )}
      {!isLoading && !error && about?.About.title.length !== 0 && (
        <div>
          <div>
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

export default page;
