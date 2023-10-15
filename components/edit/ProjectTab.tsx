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

const ProjectTab = (props: Props) => {
  const utils = trpc.useContext();

  const [currentlyDeletingProject, setCurrentlyDeletingProject] = useState<
    string | null
  >(null);
  const [currentlyEditingProject, setCurrentlyEditingProject] = useState<
    string | null
  >(null);

  const {
    data: projects,
    isLoading: isProjectLoading,
    error: projectError,
  } = trpc.getUserProjects.useQuery();

  const { mutate: deleteProject } = trpc.deleteProject.useMutation({
    onSuccess: () => {
      utils.getUserProjects.invalidate();
      toast.success("Project deleted successfully");
    },
    onMutate({ id }) {
      setCurrentlyDeletingProject(id);
    },
    onSettled() {
      setCurrentlyDeletingProject(null);
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        return toast.error(err.message);
      }
      toast.error("Request failed. Please try again.");
    },
  });

  const [openInputFields, setOpenInputFields] = useState<boolean>(false);
  const [editProject, setEditProject] = useState<boolean>(false);
  const [addingProject, setAddingProject] = useState<boolean>(false);
  const [projectFormValues, setProjectFormValues] =
    useState<TProjectPayload | null>(null);

  const ProjectValidator = z.object({
    projectId: z.string(),
    name: z.string(),
    description: z.string(),
    link: z.string(),
  });

  useEffect(() => {
    if (projectFormValues) {
      setValue("projectId", projectFormValues.projectId);
      setValue("name", projectFormValues.name);
      setValue("description", projectFormValues.description);
      setValue("link", projectFormValues.link);
    } else {
      setValue("projectId", "");
      setValue("name", "");
      setValue("description", "");
      setValue("link", "");
      setCurrentlyEditingProject(null);
    }
  }, [projectFormValues]);

  type TProjectPayload = z.infer<typeof ProjectValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TProjectPayload>({
    resolver: zodResolver(ProjectValidator),
  });

  //TODO: Hardcoded userId
  const userId = "6517cbab867897b4cda0395f";

  const handleProjectPageSubmit = ({
    projectId,
    name,
    description,
    link,
  }: TProjectPayload) => {
    setValue("name", name);
    setValue("description", description);
    setValue("link", link);
    setValue("projectId", projectId);
    if (editProject) updateProject({ link, name, description, id: projectId });
    else if (addingProject) addProject({ link, name, description, userId });
    setOpenInputFields(false);
    setEditProject(false);
    setAddingProject(false);
    setProjectFormValues(null);
    setCurrentlyEditingProject(null);
  };

  const { mutate: updateProject, isLoading: isUpdateProjectLoading } =
    trpc.editProject.useMutation({
      onSuccess: (data) => {
        utils.getUserProjects.invalidate();
        setOpenInputFields(false);
        setEditProject(false);
        setAddingProject(false);
        setProjectFormValues(null);
        setCurrentlyEditingProject(null);
        toast.success("Project updated successfully");
      },
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          return toast.error(err.message);
        }
        toast.error("Request failed. Please try again.");
      },
    });

  const { mutate: addProject, isLoading: isProjectCreating } =
    trpc.addProject.useMutation({
      onSuccess: () => {
        utils.getUserProjects.invalidate();
        setOpenInputFields(false);
        setEditProject(false);
        setAddingProject(false);
        setProjectFormValues(null);
        setCurrentlyEditingProject(null);
        toast.success("Project added successfully");
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
          <CardTitle>Project</CardTitle>
          <Button
            className="ml-2 justify-end"
            variant={"ghost"}
            onClick={() => {
              setOpenInputFields(true);
              setEditProject(false);
              setAddingProject(true);
              setProjectFormValues(null);
              setCurrentlyEditingProject(null);
            }}
          >
            <PlusCircle className="h-4 w-4" /> Add New
          </Button>
        </div>
        <CardDescription>
          Make changes to your Projects here. Click save when you&apos;re done
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
            {projects?.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="inline">
                    <p>{project.name}</p>
                  </CardTitle>
                  <CardDescription className="truncate">
                    {project.link}
                  </CardDescription>
                </CardHeader>

                <CardContent className="prose">
                  {project.description}
                </CardContent>

                <CardFooter className="flex space-x-2">
                  <Button
                    className="justify-self-start"
                    variant={"ghost"}
                    onClick={() => {
                      setAddingProject(false);
                      setEditProject(true);
                      setOpenInputFields(true);
                      setProjectFormValues({
                        projectId: project.id,
                        link: project.link,
                        name: project.name,
                        description: project.description,
                      });
                      setCurrentlyEditingProject((prev) =>
                        prev === project.id ? null : project.id
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
                        {currentlyDeletingProject === project.id ? (
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
                            deleteProject({ id: project.id });
                          }}
                        >
                          {currentlyDeletingProject === project.id ? (
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="PDFWhisper"
                  {...register("name", { value: projectFormValues?.name })}
                  className={cn(
                    "col-span-3",
                    errors.name && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="link">Link</Label>

                <Input
                  id="link"
                  placeholder="https://github.com/pandeyanup/PDFWhisper"
                  {...register("link", { value: projectFormValues?.link })}
                  className={cn(
                    "col-span-3",
                    errors.link && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  {...register("description", {
                    value: projectFormValues?.description,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.description && "focus-visible:ring-red-500"
                  )}
                  placeholder="Open-source SaaS to make chatting with your PDF files easy."
                />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              {addingProject ? (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleProjectPageSubmit)()}
                >
                  {isProjectCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleProjectPageSubmit)()}
                >
                  {isUpdateProjectLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save changes
                </Button>
              )}
              <Button
                variant={"destructive"}
                onClick={() => {
                  setOpenInputFields(false);
                  setAddingProject(false);
                  setEditProject(false);
                  setCurrentlyEditingProject(null);
                  setCurrentlyDeletingProject(null);
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

export default ProjectTab;
