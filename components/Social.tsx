"use client";

import { Social } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";

type Props = {
  className?: string;
};

const Social = (props: Props) => {
  const { toast } = useToast();
  const [socials, setSocials] = useState<Social[]>();
  useEffect(() => {
    axios
      .get("/api/social/")
      .then((response) => {
        setSocials(response.data);
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Timeout",
            description: "Try again later.",
            variant: "destructive",
          });
        }
      });
  }, []);
  return (
    <>
      {socials?.map((social) => (
        <div key={social.id} className={props.className}>
          <a href={social.href}>
            <img className="h-6 w-6" src={social.src} alt={social.alt} />
          </a>
        </div>
      ))}
    </>
  );
};

export default Social;
