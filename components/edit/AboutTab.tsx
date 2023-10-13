"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { Edit2, Loader2, Loader2Icon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "../ui/separator";

type Props = {};

const AboutTab = (props: Props) => {
  const AboutValidator = z.object({
    aboutId: z.string(),
    title: z.string(),
    bio: z.string(),
    about: z.string(),
  });

  type TAboutPayload = z.infer<typeof AboutValidator>;
  const utils = trpc.useContext();

  const [currentlyEditingAbout, setCurrentlyEditingAbout] = useState<
    string | null
  >(null);

  const {
    data: about,
    isLoading: isAboutLoading,
    error: aboutError,
  } = trpc.getUserAbout.useQuery();

  const [editAbout, setEditAbout] = useState<boolean>(false);
  const [aboutFormValues, setAboutFormValues] = useState<TAboutPayload | null>(
    null
  );

  useEffect(() => {
    if (aboutFormValues) {
      setValue("title", aboutFormValues.title);
      setValue("about", aboutFormValues.about);
      setValue("bio", aboutFormValues.bio);
      setValue("aboutId", aboutFormValues.aboutId);
    }
  }, [aboutFormValues]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TAboutPayload>({
    resolver: zodResolver(AboutValidator),
  });

  //TODO: Hardcoded userId
  const userId = "6517cbab867897b4cda0395f";

  const handlePageSubmit = ({ title, about, bio, aboutId }: TAboutPayload) => {
    setValue("title", title);
    setValue("about", about);
    setValue("bio", bio);
    setValue("aboutId", aboutId);
    // setValue("userId", userId);
    updateAbout({ title, about, bio, id: aboutId });
  };

  const queryClient = useQueryClient();

  const { mutate: updateAbout, isLoading: isUpdateAboutLoading } =
    trpc.editAbout.useMutation({
      onSuccess: (data) => {
        utils.getUserAbout.invalidate();
        setEditAbout(false);
        // Remove the form values and remove the about id from currentlyEditingAbout
        toast.success("About updated successfully");
      },
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          return toast.error(err.message);
        }
        toast.error("Request failed. Please try again.");
      },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>
          Make changes to your About here. Click save when you're done editing.
        </CardDescription>
      </CardHeader>
      <div>
        {isAboutLoading ? (
          <p className="flex items-center justify-center content-center">
            <Loader2 className="h-4 w-4 animate-spin mr-4" /> Loading...
          </p>
        ) : (
          <div className="p-4 w-auto">
            <Card>
              <CardHeader>
                <CardTitle className="inline">{about?.About.title}</CardTitle>
                <CardDescription>{about?.About.bio}</CardDescription>
              </CardHeader>
              <CardContent className="text-justify">
                {about?.About.about}
              </CardContent>
              <CardFooter>
                <Button
                  className="justify-self-start"
                  variant={"ghost"}
                  onClick={() => {
                    setAboutFormValues({
                      aboutId: about?.About.id!,
                      title: about?.About.title!,
                      bio: about?.About.bio!,
                      about: about?.About.about!,
                    });
                    setEditAbout(true);
                    setCurrentlyEditingAbout((prev) =>
                      prev === about?.About.id ? null : about?.About.id!
                    );
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      {editAbout ? (
        <>
          <Separator />
          <div className="mt-6">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Full-Stack Developer"
                  {...register("title", { value: aboutFormValues?.title })}
                  className={cn(
                    "col-span-3",
                    errors.title && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio">Bio</Label>

                <Input
                  id="bio"
                  placeholder="Always finding new ways to learn something awesome."
                  {...register("bio", { value: aboutFormValues?.bio })}
                  className={cn(
                    "col-span-3",
                    errors.bio && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="about">About</Label>
                <Input
                  id="about"
                  {...register("about", { value: aboutFormValues?.about })}
                  className={cn(
                    "col-span-3",
                    errors.about && "focus-visible:ring-red-500"
                  )}
                  placeholder="Write a bio about yourself"
                />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button
                type="submit"
                onClick={() => handleSubmit(handlePageSubmit)()}
              >
                {isUpdateAboutLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Save changes
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setEditAbout(false);
                  setCurrentlyEditingAbout(null);
                }}
              >
                Cancel
              </Button>
            </CardFooter>
          </div>
        </>
      ) : null}
    </Card>
  );
};

export default AboutTab;
