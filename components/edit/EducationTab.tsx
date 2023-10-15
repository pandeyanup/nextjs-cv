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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Edit2, Loader2, Loader2Icon, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
    data: educations,
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

  const [openInputFields, setOpenInputFields] = useState<boolean>(false);
  const [editEducation, setEditEducation] = useState<boolean>(false);
  const [addingEducation, setAddingEducation] = useState<boolean>(false);
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
    } else {
      setValue("educationId", "");
      setValue("degree", "");
      setValue("school", "");
      setValue("description", "");
      setValue("startYear", "");
      setValue("endYear", "");
      setValue("field", "");
      setCurrentlyEditingEducation(null);
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
    if (editEducation)
      updateEducation({
        id,
        school,
        degree,
        description,
        startYear,
        endYear,
        field,
      });
    else if (addingEducation)
      addEducation({
        userId,
        school,
        degree,
        description,
        startYear,
        endYear,
        field,
      });
    setOpenInputFields(false);
    setEditEducation(false);
    setAddingEducation(false);
    setEducationFormValues(null);
    setCurrentlyEditingEducation(null);
  };

  const { mutate: updateEducation, isLoading: isUpdateEducationLoading } =
    trpc.editEducation.useMutation({
      onSuccess: (data) => {
        utils.getUserEducation.invalidate();
        setOpenInputFields(false);
        setEditEducation(false);
        setAddingEducation(false);
        setEducationFormValues(null);
        setCurrentlyEditingEducation(null);
        toast.success("Education updated successfully");
      },
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          return toast.error(err.message);
        }
        toast.error("Request failed. Please try again.");
      },
    });

  const { mutate: addEducation, isLoading: isEducationCreating } =
    trpc.addEducation.useMutation({
      onSuccess: () => {
        utils.getUserEducation.invalidate();
        setOpenInputFields(false);
        setEditEducation(false);
        setAddingEducation(false);
        setEducationFormValues(null);
        setCurrentlyEditingEducation(null);
        toast.success("Education added successfully");
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
        <div className="flex w-full justify-between items-center">
          <CardTitle>Education</CardTitle>
          <Button
            className="ml-2 justify-end"
            variant={"ghost"}
            onClick={() => {
              setOpenInputFields(true);
              setEditEducation(false);
              setAddingEducation(true);
              setEducationFormValues(null);
              setCurrentlyEditingEducation(null);
            }}
          >
            <PlusCircle className="h-4 w-4" /> Add New
          </Button>
        </div>
        <CardDescription>
          Make changes to your Educations here. Click save when you&apos;re done
          editing.
        </CardDescription>
      </CardHeader>
      <div>
        <ScrollArea
          className={cn("w-auto", {
            "relative h-[420px]": !openInputFields,
            "h-72": openInputFields,
          })}
        >
          <div className="p-4 space-y-4">
            {educations?.map((education) => (
              <Card key={education.id}>
                <CardHeader>
                  <CardTitle className="inline">
                    <div className="flex items-center">
                      <p>{education.school}</p>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <p>
                      {education.degree} ({education.startYear}-
                      {education.endYear})
                    </p>
                  </CardDescription>
                </CardHeader>
                {education.field ? (
                  <CardContent>{education.field}</CardContent>
                ) : null}
                <CardFooter className="flex space-x-2">
                  <Button
                    className="justify-self-start"
                    variant={"ghost"}
                    onClick={() => {
                      setAddingEducation(false);
                      setEditEducation(true);
                      setOpenInputFields(true);
                      setEducationFormValues({
                        educationId: education.id,
                        school: education.school,
                        description: education.description,
                        endYear: education.endYear,
                        startYear: education.startYear,
                        degree: education.degree,
                        field: education.field,
                      });
                      setCurrentlyEditingEducation((prev) =>
                        prev === education.id ? null : education.id
                      );
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="justify-self-start"
                        variant={"destructive"}
                      >
                        {currentlyDeletingEducation === education.id ? (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. Are you sure you want to
                          permanently delete this item from our servers?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            deleteEducation({ id: education.id });
                          }}
                        >
                          {currentlyDeletingEducation === education.id ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          ) : (
                            <div className="inline">
                              <div className="flex items-center space-x-2">
                                <Trash2 className="h-4 w-4" />
                                <p>Delete</p>
                              </div>
                            </div>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
      {openInputFields ? (
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
                    placeholder="2018"
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
                    placeholder="2023"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              {addingEducation ? (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleEducationPageSubmit)()}
                >
                  {isEducationCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleEducationPageSubmit)()}
                >
                  {isUpdateEducationLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save changes
                </Button>
              )}
              <Button
                variant={"destructive"}
                onClick={() => {
                  setOpenInputFields(false);
                  setAddingEducation(false);
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
