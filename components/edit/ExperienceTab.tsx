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
import { set, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "../ui/separator";

type Props = {};

const ExperienceTab = (props: Props) => {
  const utils = trpc.useContext();

  const [currentlyDeletingExperience, setCurrentlyDeletingExperience] =
    useState<string | null>(null);
  const [currentlyEditingExperience, setCurrentlyEditingExperience] = useState<
    string | null
  >(null);

  const {
    data: experience,
    isLoading: isExperienceLoading,
    error: experienceError,
  } = trpc.getUserExperience.useQuery();

  const { mutate: deleteExperience } = trpc.deleteExperience.useMutation({
    onSuccess: () => {
      utils.getUserExperience.invalidate();
      toast.success("Experience deleted successfully");
    },
    onMutate({ id }) {
      setCurrentlyDeletingExperience(id);
    },
    onSettled() {
      setCurrentlyDeletingExperience(null);
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        return toast.error(err.message);
      }
      toast.error("Request failed. Please try again.");
    },
  });

  const [editExperience, setEditExperience] = useState<boolean>(false);
  const [experienceFormValues, setExperienceFormValues] =
    useState<TExperiencePayload | null>(null);

  const ExperienceValidator = z.object({
    experienceId: z.string(),
    company: z.string(),
    position: z.string(),
    description: z.string().nullable(),
    startYear: z.string(),
    endYear: z.string(),
  });

  useEffect(() => {
    if (experienceFormValues) {
      setValue("experienceId", experienceFormValues.experienceId);
      setValue("position", experienceFormValues.position);
      setValue("description", experienceFormValues.description);
      setValue("startYear", experienceFormValues.startYear);
      setValue("endYear", experienceFormValues.endYear);
    }
  }, [experienceFormValues]);

  type TExperiencePayload = z.infer<typeof ExperienceValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TExperiencePayload>({
    resolver: zodResolver(ExperienceValidator),
  });

  //TODO: Hardcoded userId
  const userId = "6517cbab867897b4cda0395f";

  const handleExperiencePageSubmit = ({
    experienceId: id,
    position,
    company,
    description,
    endYear,
    startYear,
  }: TExperiencePayload) => {
    setValue("company", company);
    setValue("description", description);
    setValue("endYear", endYear);
    setValue("startYear", startYear);
    setValue("position", position);

    updateExperience({
      id,
      company,
      description,
      endYear,
      position,
      startYear,
    });
  };

  const { mutate: updateExperience, isLoading: isUpdateExperienceLoading } =
    trpc.editExperience.useMutation({
      onSuccess: (data) => {
        utils.getUserExperience.invalidate();
        setEditExperience(false);
        // Remove the form values and remove the social id from currentlyEditingSocial
        toast.success("Experience updated successfully");
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
        <CardTitle>Education</CardTitle>
        <CardDescription>
          Make changes to your Experiences here. Click save when you're done
          editing.
        </CardDescription>
      </CardHeader>
      <div>
        <ScrollArea
          className={cn("w-auto", {
            "relative h-[420px]": !editExperience,
            "h-72": editExperience,
          })}
        >
          <div className="p-4 space-y-4">
            {experience?.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <CardTitle className="inline">
                    <div className="flex items-center">
                      <p>{exp.company}</p>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <p>
                      {exp.position} ({exp.startYear}-{exp.endYear})
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent>{exp.description}</CardContent>
                <CardFooter className="flex space-x-2">
                  <Button
                    className="justify-self-start"
                    variant={"ghost"}
                    onClick={() => {
                      setExperienceFormValues({
                        experienceId: exp.id,
                        position: exp.position,
                        company: exp.company,
                        description: exp.description,
                        endYear: exp.endYear,
                        startYear: exp.startYear,
                      });
                      setEditExperience(true);
                      setCurrentlyEditingExperience((prev) =>
                        prev === exp.id ? null : exp.id
                      );
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="justify-self-start"
                    variant={"destructive"}
                    onClick={() => {
                      deleteExperience({ id: exp.id });
                    }}
                  >
                    {currentlyDeletingExperience === exp.id ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
      {editExperience ? (
        <>
          <Separator />
          <div className="mt-6">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company Name"
                  {...register("company", {
                    value: experienceFormValues?.company,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.company && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Position"
                  {...register("position", {
                    value: experienceFormValues?.position,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.position && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Description about your work experience"
                  {...register("description", {
                    value: experienceFormValues?.description,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.description && "focus-visible:ring-red-500"
                  )}
                />
              </div>

              <div className="grid grid-cols-2 space-x-2">
                <div className="space-y-1">
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    {...register("startYear", {
                      value: experienceFormValues?.startYear,
                    })}
                    className={cn(
                      "col-span-3",
                      errors.startYear && "focus-visible:ring-red-500"
                    )}
                    placeholder="80"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    {...register("endYear", {
                      value: experienceFormValues?.endYear,
                    })}
                    className={cn(
                      "col-span-3",
                      errors.endYear && "focus-visible:ring-red-500"
                    )}
                    placeholder="80"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button
                type="submit"
                onClick={() => handleSubmit(handleExperiencePageSubmit)()}
              >
                {isUpdateExperienceLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Save changes
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setEditExperience(false);
                  setCurrentlyEditingExperience(null);
                  setCurrentlyDeletingExperience(null);
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

export default ExperienceTab;
