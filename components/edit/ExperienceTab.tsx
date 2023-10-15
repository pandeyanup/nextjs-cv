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

const ExperienceTab = (props: Props) => {
  const utils = trpc.useContext();

  const [currentlyDeletingExperience, setCurrentlyDeletingExperience] =
    useState<string | null>(null);
  const [currentlyEditingExperience, setCurrentlyEditingExperience] = useState<
    string | null
  >(null);

  const {
    data: experiences,
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

  const [openInputFields, setOpenInputFields] = useState<boolean>(false);
  const [editExperience, setEditExperience] = useState<boolean>(false);
  const [addingExperience, setAddingExperience] = useState<boolean>(false);
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
    } else {
      setValue("experienceId", "");
      setValue("position", "");
      setValue("description", "");
      setValue("startYear", "");
      setValue("endYear", "");
      setCurrentlyEditingExperience(null);
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
    if (editExperience)
      updateExperience({
        id,
        company,
        description,
        endYear,
        position,
        startYear,
      });
    else if (addingExperience)
      addExperience({
        company,
        description,
        endYear,
        position,
        startYear,
        userId,
      });
    setOpenInputFields(false);
    setEditExperience(false);
    setAddingExperience(false);
    setExperienceFormValues(null);
    setCurrentlyEditingExperience(null);
  };

  const { mutate: updateExperience, isLoading: isUpdateExperienceLoading } =
    trpc.editExperience.useMutation({
      onSuccess: (data) => {
        utils.getUserExperience.invalidate();
        setOpenInputFields(false);
        setEditExperience(false);
        setAddingExperience(false);
        setExperienceFormValues(null);
        setCurrentlyEditingExperience(null);
        toast.success("Experience updated successfully");
      },
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          return toast.error(err.message);
        }
        toast.error("Request failed. Please try again.");
      },
    });

  const { mutate: addExperience, isLoading: isExperienceCreating } =
    trpc.addExperience.useMutation({
      onSuccess: () => {
        utils.getUserExperience.invalidate();
        setOpenInputFields(false);
        setEditExperience(false);
        setAddingExperience(false);
        setExperienceFormValues(null);
        setCurrentlyEditingExperience(null);
        toast.success("Experience added successfully");
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
          <CardTitle>Experience</CardTitle>
          <Button
            className="ml-2 justify-end"
            variant={"ghost"}
            onClick={() => {
              setOpenInputFields(true);
              setEditExperience(false);
              setAddingExperience(true);
              setExperienceFormValues(null);
              setCurrentlyEditingExperience(null);
            }}
          >
            <PlusCircle className="h-4 w-4" /> Add New
          </Button>
        </div>
        <CardDescription>
          Make changes to your Experiences here. Click save when you&apos;re
          done editing.
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
            {experiences?.length ? (
              experiences?.map((experience) => (
                <Card key={experience.id}>
                  <CardHeader>
                    <CardTitle className="inline">
                      <div className="flex items-center">
                        <p>{experience.company}</p>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      <p>
                        {experience.position} ({experience.startYear}-
                        {experience.endYear})
                      </p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{experience.description}</CardContent>
                  <CardFooter className="flex space-x-2">
                    <Button
                      className="justify-self-start"
                      variant={"ghost"}
                      onClick={() => {
                        setAddingExperience(false);
                        setEditExperience(true);
                        setOpenInputFields(true);
                        setExperienceFormValues({
                          experienceId: experience.id,
                          position: experience.position,
                          company: experience.company,
                          description: experience.description,
                          endYear: experience.endYear,
                          startYear: experience.startYear,
                        });
                        setCurrentlyEditingExperience((prev) =>
                          prev === experience.id ? null : experience.id
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
                          {currentlyDeletingExperience === experience.id ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure absolutely sure?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. Are you sure you want
                            to permanently delete this item from our servers?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant={"destructive"}
                            onClick={() => {
                              deleteExperience({ id: experience.id });
                            }}
                          >
                            {currentlyDeletingExperience === experience.id ? (
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
              ))
            ) : (
              <p className="flex items-center justify-center content-center">
                No data found.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
      {openInputFields ? (
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
              {addingExperience ? (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleExperiencePageSubmit)()}
                >
                  {isExperienceCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleExperiencePageSubmit)()}
                >
                  {isUpdateExperienceLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save changes
                </Button>
              )}
              <Button
                variant={"destructive"}
                onClick={() => {
                  setOpenInputFields(false);
                  setAddingExperience(false);
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
