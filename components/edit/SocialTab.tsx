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

const SocialTab = (props: Props) => {
  const utils = trpc.useContext();

  const [currentlyDeletingSocial, setCurrentlyDeletingSocial] = useState<
    string | null
  >(null);
  const [currentlyEditingSocial, setCurrentlyEditingSocial] = useState<
    string | null
  >(null);

  const {
    data: socials,
    isLoading: isSocialLoading,
    error: socialError,
  } = trpc.getUserSocial.useQuery();

  const { mutate: deleteSocial } = trpc.deleteSocial.useMutation({
    onSuccess: () => {
      utils.getUserSocial.invalidate();
      toast.success("Social deleted successfully");
    },
    onMutate({ id }) {
      setCurrentlyDeletingSocial(id);
    },
    onSettled() {
      setCurrentlyDeletingSocial(null);
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        return toast.error(err.message);
      }
      toast.error("Request failed. Please try again.");
    },
  });

  const [openInputFields, setOpenInputFields] = useState<boolean>(false);
  const [editSocial, setEditSocial] = useState<boolean>(false);
  const [addingSocial, setAddingSocial] = useState<boolean>(false);
  const [socialFormValues, setSocialFormValues] =
    useState<TSocialPayload | null>(null);

  const SocialValidator = z.object({
    socialId: z.string(),
    href: z.string().url(),
    src: z.string().url(),
    alt: z.string(),
    // userId: z.string(),
  });

  useEffect(() => {
    if (socialFormValues) {
      setValue("alt", socialFormValues.alt);
      setValue("href", socialFormValues.href);
      setValue("src", socialFormValues.src);
      setValue("socialId", socialFormValues.socialId);
    } else {
      setValue("alt", "");
      setValue("href", "");
      setValue("src", "");
      setValue("socialId", "");
      setCurrentlyEditingSocial(null);
    }
  }, [socialFormValues]);

  type TSocialPayload = z.infer<typeof SocialValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TSocialPayload>({
    resolver: zodResolver(SocialValidator),
  });

  //TODO: Hardcoded userId
  const userId = "6517cbab867897b4cda0395f";

  const handleSocialPageSubmit = ({
    src,
    alt,
    href,
    socialId,
  }: TSocialPayload) => {
    setValue("alt", alt);
    setValue("href", href);
    setValue("src", src);
    setValue("socialId", socialId);
    if (editSocial) updateSocial({ src, alt, href, id: socialId });
    else if (addingSocial) addSocial({ src, alt, href, userId });
  };

  const { mutate: updateSocial, isLoading: isUpdateSocialLoading } =
    trpc.editSocial.useMutation({
      onSuccess: (data) => {
        utils.getUserSocial.invalidate();
        setOpenInputFields(false);
        setAddingSocial(false);
        setEditSocial(false);
        setCurrentlyEditingSocial(null);
        setCurrentlyDeletingSocial(null);
        toast.success("Social updated successfully");
      },
      onError: (err) => {
        if (err instanceof TRPCClientError) {
          return toast.error(err.message);
        }
        toast.error("Request failed. Please try again.");
      },
    });

  const { mutate: addSocial, isLoading: isSocialCreating } =
    trpc.addSocial.useMutation({
      onSuccess: () => {
        utils.getUserSocial.invalidate();
        setOpenInputFields(false);
        setEditSocial(false);
        setAddingSocial(false);
        setSocialFormValues(null);
        setCurrentlyEditingSocial(null);
        toast.success("Social added successfully");
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
          <CardTitle>Social</CardTitle>
          <Button
            className="ml-2 justify-end"
            variant={"ghost"}
            onClick={() => {
              setOpenInputFields(true);
              setAddingSocial(true);
              setEditSocial(false);
              setCurrentlyEditingSocial(null);
              setCurrentlyDeletingSocial(null);
            }}
          >
            <PlusCircle className="h-4 w-4" /> Add New
          </Button>
        </div>
        <CardDescription>
          Make changes to your Socials here. Click save when you're done
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
            {socials?.map((social) => (
              <Card key={social.alt}>
                <CardHeader>
                  <CardTitle className="inline">
                    <div className="flex items-center">
                      <img
                        className="h-6 w-6 mr-2"
                        src={social.src}
                        alt={social.alt}
                      />
                      <p>{social.alt}</p>
                    </div>
                  </CardTitle>
                  <CardDescription>{social.href}</CardDescription>
                </CardHeader>
                <CardContent className="flex space-x-2">
                  <Button
                    className="justify-self-start"
                    variant={"ghost"}
                    onClick={() => {
                      setSocialFormValues({
                        href: social.href,
                        src: social.src,
                        alt: social.alt,
                        socialId: social.id,
                      });
                      setOpenInputFields(true);
                      setCurrentlyEditingSocial((prev) =>
                        prev === social.id ? null : social.id
                      );
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="justify-self-start"
                    variant={"destructive"}
                    onClick={() => {
                      deleteSocial({ id: social.id });
                    }}
                  >
                    {currentlyDeletingSocial === social.id ? (
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
                  id="alt"
                  placeholder="LinkedIn"
                  {...register("alt", { value: socialFormValues?.alt })}
                  className={cn(
                    "col-span-3",
                    errors.alt && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="href">Icon URL</Label>

                <Input
                  id="src"
                  placeholder="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                  {...register("src", { value: socialFormValues?.src })}
                  className={cn(
                    "col-span-3",
                    errors.src && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Social URL</Label>
                <Input
                  id="href"
                  {...register("href", { value: socialFormValues?.href })}
                  className={cn(
                    "col-span-3",
                    errors.href && "focus-visible:ring-red-500"
                  )}
                  placeholder="https://www.linkedin.com/in/pandeyanup/"
                />
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              {addingSocial ? (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleSocialPageSubmit)()}
                >
                  {isSocialCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={() => handleSubmit(handleSocialPageSubmit)()}
                >
                  {isUpdateSocialLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save changes
                </Button>
              )}
              <Button
                variant={"destructive"}
                onClick={() => {
                  setOpenInputFields(false);
                  setAddingSocial(false);
                  setEditSocial(false);
                  setCurrentlyEditingSocial(null);
                  setCurrentlyDeletingSocial(null);
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

export default SocialTab;
