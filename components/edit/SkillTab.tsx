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
import { TRPCClientError } from "@trpc/client";
import { Edit2, Loader2, Loader2Icon, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "../ui/separator";

type Props = {};

const SkillTab = (props: Props) => {
  const utils = trpc.useContext();

  const [currentlyDeletingSkill, setCurrentlyDeletingSkill] = useState<
    string | null
  >(null);
  const [currentlyEditingSkill, setCurrentlyEditingSkill] = useState<
    string | null
  >(null);

  const {
    data: skills,
    isLoading: isSkillLoading,
    error: skillError,
  } = trpc.getUserSkills.useQuery();

  const { mutate: deleteSkill } = trpc.deleteSkill.useMutation({
    onSuccess: () => {
      utils.getUserSkills.invalidate();
      toast.success("Skill deleted successfully");
    },
    onMutate({ id }) {
      setCurrentlyDeletingSkill(id);
    },
    onSettled() {
      setCurrentlyDeletingSkill(null);
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        return toast.error(err.message);
      }
      toast.error("Request failed. Please try again.");
    },
  });

  const [openInputFields, setOpenInputFields] = useState<boolean>(false);
  const [editSkill, setEditSkill] = useState<boolean>(false);
  const [addingSkill, setAddingSkill] = useState<boolean>(false);
  const [skillFormValues, setSkillFormValues] = useState<TSkillPayload | null>(
    null
  );

  const SkillValidator = z.object({
    skillId: z.string(),
    src: z.string(),
    name: z.string(),
    proficiency: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= 100),
  });

  useEffect(() => {
    if (skillFormValues) {
      setValue("skillId", skillFormValues.skillId);
      setValue("name", skillFormValues.name);
      setValue("src", skillFormValues.src);
      setValue("proficiency", skillFormValues.proficiency);
    } else {
      setValue("skillId", "");
      setValue("name", "");
      setValue("src", "");
      setValue("proficiency", "");
      setCurrentlyEditingSkill(null);
    }
  }, [skillFormValues]);

  type TSkillPayload = z.infer<typeof SkillValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TSkillPayload>({
    resolver: zodResolver(SkillValidator),
  });

  //TODO: Hardcoded userId
  const userId = "6517cbab867897b4cda0395f";

  const handleSkillPageSubmit = ({
    skillId,
    name,
    proficiency,
    src,
  }: TSkillPayload) => {
    setValue("name", name);
    setValue("src", src);
    setValue("proficiency", proficiency);
    setValue("skillId", skillId);
    if (editSkill) updateSkill({ src, name, proficiency, id: skillId });
    else if (addingSkill) addSkill({ src, name, proficiency, userId });
    setOpenInputFields(false);
    setEditSkill(false);
    setAddingSkill(false);
    setSkillFormValues(null);
    setCurrentlyEditingSkill(null);
  };

  const { mutate: updateSkill, isLoading: isUpdateSkillLoading } =
    trpc.editSkill.useMutation({
      onSuccess: (data) => {
        utils.getUserSkills.invalidate();
        setOpenInputFields(false);
        setEditSkill(false);
        setAddingSkill(false);
        setSkillFormValues(null);
        setCurrentlyEditingSkill(null);
        toast.success("Skill updated successfully");
      },
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          return toast.error(err.message);
        }
        toast.error("Request failed. Please try again.");
      },
    });

  const { mutate: addSkill, isLoading: isSkillCreating } =
    trpc.addSkill.useMutation({
      onSuccess: () => {
        utils.getUserSkills.invalidate();
        setOpenInputFields(false);
        setEditSkill(false);
        setAddingSkill(false);
        setSkillFormValues(null);
        setCurrentlyEditingSkill(null);
        toast.success("Skill added successfully");
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
          <CardTitle>Skill</CardTitle>
          <Button
            className="ml-2 justify-end"
            variant={"ghost"}
            onClick={() => {
              setOpenInputFields(true);
              setEditSkill(false);
              setAddingSkill(true);
              setSkillFormValues(null);
              setCurrentlyEditingSkill(null);
            }}
          >
            <PlusCircle className="h-4 w-4" /> Add New
          </Button>
        </div>
        <CardDescription>
          Make changes to your Skills here. Click save when you&apos;re done
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
            {skills?.all.map((skill) => (
              <Card key={skill.id}>
                <CardHeader>
                  <CardTitle className="inline">
                    <div className="flex items-center">
                      <img
                        className="h-6 w-6 mr-2"
                        src={skill.src}
                        alt={skill.name}
                      />
                      <p>{skill.name}</p>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Proficiency: {skill.proficiency}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex space-x-2">
                  <Button
                    className="justify-self-start"
                    variant={"ghost"}
                    onClick={() => {
                      setAddingSkill(false);
                      setEditSkill(true);
                      setOpenInputFields(true);
                      setSkillFormValues({
                        skillId: skill.id,
                        src: skill.src,
                        name: skill.name,
                        proficiency: skill.proficiency,
                      });
                      setCurrentlyEditingSkill((prev) =>
                        prev === skill.id ? null : skill.id
                      );
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="justify-self-start"
                    variant={"destructive"}
                    onClick={() => {
                      deleteSkill({ id: skill.id });
                    }}
                  >
                    {currentlyDeletingSkill === skill.id ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
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
                  placeholder="Python"
                  {...register("name", { value: skillFormValues?.name })}
                  className={cn(
                    "col-span-3",
                    errors.name && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="href">Skill Image URL</Label>

                <Input
                  id="src"
                  placeholder="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                  {...register("src", { value: skillFormValues?.src })}
                  className={cn(
                    "col-span-3",
                    errors.src && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="proficiency">Proficiency</Label>
                <Input
                  id="proficiency"
                  {...register("proficiency", {
                    value: skillFormValues?.proficiency,
                  })}
                  className={cn(
                    "col-span-3",
                    errors.proficiency && "focus-visible:ring-red-500"
                  )}
                  placeholder="80"
                />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              {addingSkill ? (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleSkillPageSubmit)()}
                >
                  {isSkillCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleSkillPageSubmit)()}
                >
                  {isUpdateSkillLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save changes
                </Button>
              )}
              <Button
                variant={"destructive"}
                onClick={() => {
                  setOpenInputFields(false);
                  setAddingSkill(false);
                  setEditSkill(false);
                  setCurrentlyEditingSkill(null);
                  setCurrentlyDeletingSkill(null);
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

export default SkillTab;
