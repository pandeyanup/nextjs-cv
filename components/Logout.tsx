"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type Props = {};

const Logout = (props: Props) => {
  return (
    <div className="flex justify-center items-center p-5">
      <Button
        variant={"outline"}
        onClick={() => {
          signOut();
        }}
        className="space-x-2"
      >
        <p>Logout</p> <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Logout;
