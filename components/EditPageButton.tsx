"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

type Props = {};

const EditPageButton = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center p-5">
      <Button
        variant={"outline"}
        onClick={() => {
          router.push("/edit");
        }}
        className="space-x-2"
      >
        <p>Edit Page</p> <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditPageButton;
