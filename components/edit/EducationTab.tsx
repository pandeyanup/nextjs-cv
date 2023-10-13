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

const EducationTab = (props: Props) => {
  const utils = trpc.useContext();

  const [currentlyDeletingEducation, setCurrentlyDeletingEducation] = useState<
    string | null
  >(null);
  const [currentlyEditingEducation, setCurrentlyEditingEducation] = useState<
    string | null
  >(null);

  const {
    data: education,
    isLoading: isEducationLoading,
    error: educationError,
  } = trpc.getUserEducation.useQuery();

  const { mutate: deleteEducation } = trpc.deleteEducation.useMutation({
    onSuccess: () => {
      utils.getUserEducation.invalidate();
      toast.success("Education deleted successfully");
    },
    onMutate({ id }) {
      setCurrentlyDeletingEducation(id);
    },
    onSettled() {
      setCurrentlyDeletingEducation(null);
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        return toast.error(err.message);
      }
      toast.error("Request failed. Please try again.");
    },
  });

  const [editEducation, setEditEducation] = useState<boolean>(false);
  const [educationFormValues, setEducationFormValues] =
    useState<TEducationPayload | null>(null);

  const EducationValidator = z.object({
    educationId: z.string(),
    school: z.string(),
    description: z.string(),
    startYear: z
      .string()
      .refine((num) => Number(num) > 1990 && Number(num) <= 2100),
    endYear: z
      .string()
      .refine((num) => Number(num) > 1990 && Number(num) <= 2100),
    degree: z.string(),
    field: z.string().nullable(),
  });

  useEffect(() => {
    if (educationFormValues) {
      setValue("educationId", educationFormValues.educationId);
      setValue("degree", educationFormValues.degree);
      setValue("school", educationFormValues.school);
      setValue("description", educationFormValues.description);
      setValue("startYear", educationFormValues.startYear);
      setValue("endYear", educationFormValues.endYear);
      setValue("field", educationFormValues.field);
    }
  }, [educationFormValues]);

  type TEducationPayload = z.infer<typeof EducationValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TEducationPayload>({
    resolver: zodResolver(EducationValidator),
  });

  //TODO: Hardcoded userId
  const userId = "6517cbab867897b4cda0395f";

  const handleEducationPageSubmit = ({
    educationId: id,
    degree,
    description,
    endYear,
    startYear,
    school,
    field,
  }: TEducationPayload) => {
    setValue("degree", degree);
    setValue("school", school);
    setValue("description", description);
    setValue("endYear", endYear);
    setValue("endYear", endYear);
    setValue("startYear", startYear);
    setValue("field", field);

    updateEducation({
      id,
      school,
      degree,
      description,
      startYear,
      endYear,
      field,
    });
  };

  const { mutate: updateEducation, isLoading: isUpdateEducationLoading } =
    trpc.editEducation.useMutation({
      onSuccess: (data) => {
        utils.getUserEducation.invalidate();
        setEditEducation(false);
        // Remove the form values and remove the social id from currentlyEditingSocial
        toast.success("Education updated successfully");
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
          Make changes to your Educations here. Click save when you're done
          editing.
        </CardDescription>
      </CardHeader>
      <div>
        <ScrollArea
          className={cn("w-auto", {
            "relative h-[420px]": !editEducation,
            "h-72": editEducation,
          })}
        >
          <div className="p-4 space-y-4">
            {education?.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <CardTitle className="inline">
                    <div className="flex items-center">
                      <p>{edu.school}</p>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <p>
                      {edu.degree} ({edu.startYear}-{edu.endYear})
                    </p>
                  </CardDescription>
                </CardHeader>
                {edu.field ? <CardContent>{edu.field}</CardContent> : null}
                <CardFooter className="flex space-x-2">
                  <Button
                    className="justify-self-start"
                    variant={"ghost"}
                    onClick={() => {
                      setEducationFormValues({
                        educationId: edu.id,
                        school: edu.school,
                        description: edu.description,
                        endYear: edu.endYear,
                        startYear: edu.startYear,
                        degree: edu.degree,
                        field: edu.field,
                      });
                      setEditEducation(true);
                      setCurrentlyEditingEducation((prev) =>
                        prev === edu.id ? null : edu.id
                      );
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="justify-self-start"
                    variant={"destructive"}
                    onClick={() => {
                      deleteEducation({ id: edu.id });
                    }}
                  >
                    {currentlyDeletingEducation === edu.id ? (
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
      {editEducation ? (
        <>
          <Separator />
          <div className="mt-6">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  placeholder="IOE Purwanchal Campus"
                  {...register("school", {
                    value: educationFormValues?.school,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.school && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Studied Bachelor in Computer Engineering"
                  {...register("description", {
                    value: educationFormValues?.description,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.description && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  placeholder="Bachelor Degree"
                  {...register("degree", {
                    value: educationFormValues?.degree,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.degree && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="field">Field</Label>
                <Input
                  id="field"
                  {...register("field", {
                    value: educationFormValues?.field,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.field && "focus-visible:ring-red-500"
                  )}
                  placeholder="Computer Engineering"
                />
              </div>
              <div className="grid grid-cols-2 space-x-2">
                <div className="space-y-1">
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    {...register("startYear", {
                      value: educationFormValues?.startYear,
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
                      value: educationFormValues?.endYear,
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
                onClick={() => handleSubmit(handleEducationPageSubmit)()}
              >
                {isUpdateEducationLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Save changes
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setEditEducation(false);
                  setCurrentlyEditingEducation(null);
                  setCurrentlyDeletingEducation(null);
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

export default EducationTab;
