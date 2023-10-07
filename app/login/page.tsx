"use client";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Github, Loader2 } from "lucide-react";
import { z } from "zod";
import { trpc } from "../_trpc/client";
import { LoginValidator, TLoginPayload } from "@/lib/validator/secret";

type Props = {};

const Page = (props: Props) => {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TLoginPayload>({
    resolver: zodResolver(LoginValidator),
  });

  const handlePageSubmit = ({ email, password }: TLoginPayload) => {
    setEmail(email);
    setPassword(password);
    setValue("email", email);
    setValue("password", password);
    CheckSecret({ email, password });
  };

  const {
    mutate: CheckSecret,
    error: apiError,
    isLoading,
  } = trpc.loginRequest.useMutation({
    onSuccess: (data) => {
      router.push("/skill");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
      toast({
        title: "Error",
        description: "Request failed. Please try again.",
        variant: "destructive",
      });
    },
    mutationFn: async () => {
      const payload: TLoginPayload = {
        email: email,
        password: password,
      };

      const { data } = await axios.post("/api/login", payload);
      return data;
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Login</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>
                To make changes to your profile, please enter the credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center animate-in">
              {apiError || errors.email || errors.password ? (
                <div className="text-red-500 text-sm">{apiError?.message}</div>
              ) : null}
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  {...register("email")}
                  className={cn(
                    "col-span-3",
                    errors.email && "focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  {...register("password")}
                  className={cn(
                    "col-span-3",
                    errors.password && "focus-visible:ring-red-500"
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => handleSubmit(handlePageSubmit)()}
              >
                Login
                {isLoading ? (
                  <Loader2 className="h-4 w-4 inline-block ml-2 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 inline-block ml-2" />
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;
