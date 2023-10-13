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

  const [editProject, setEditProject] = useState<boolean>(false);
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
    updateProject({ link, name, description, id: projectId });
  };

  const queryClient = useQueryClient();

  const { mutate: updateProject, isLoading: isUpdateProjectLoading } =
    trpc.editProject.useMutation({
      onSuccess: (data) => {
        utils.getUserProjects.invalidate();
        setEditProject(false);
        // Remove the form values and remove the social id from currentlyEditingSocial
        toast.success("Project updated successfully");
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
        <CardTitle>Project</CardTitle>
        <CardDescription>
          Make changes to your Projects here. Click save when you're done
          editing.
        </CardDescription>
      </CardHeader>
      <div>
        <ScrollArea
          className={cn("w-auto", {
            "relative h-[420px]": !editProject,
            "h-72": editProject,
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
                      setProjectFormValues({
                        projectId: project.id,
                        link: project.link,
                        name: project.name,
                        description: project.description,
                      });
                      setEditProject(true);
                      setCurrentlyEditingProject((prev) =>
                        prev === project.id ? null : project.id
                      );
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="justify-self-start"
                    variant={"destructive"}
                    onClick={() => {
                      deleteProject({ id: project.id });
                    }}
                  >
                    {currentlyDeletingProject === project.id ? (
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
      {editProject ? (
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
              <Button
                type="submit"
                onClick={() => handleSubmit(handleProjectPageSubmit)()}
              >
                {isUpdateProjectLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Save changes
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
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
