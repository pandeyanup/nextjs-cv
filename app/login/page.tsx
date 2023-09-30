"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="password" placeholder="Secret" />
        <Button onClick={() => {}}>Forward</Button>
      </div>
    </div>
  );
};

export default page;
