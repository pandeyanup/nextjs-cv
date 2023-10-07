"use client";

import { trpc } from "@/app/_trpc/client";

type Props = {
  className?: string;
};

const Social = (props: Props) => {
  const {
    data: socials,
    isLoading: isLoading,
    error: error,
  } = trpc.getUserSocial.useQuery();
  return (
    <div className={props.className}>
      {socials?.map((social) => (
        <a key={social.id} href={social.href}>
          <img className="h-6 w-6" src={social.src} alt={social.alt} />
        </a>
      ))}
    </div>
  );
};

export default Social;
