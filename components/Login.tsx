"use client";

import { trpc } from "@/app/_trpc/client";
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
import { LoginValidator, TLoginPayload } from "@/lib/validator/secret";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {};

const Login = (props: Props) => {
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
    onSuccess: () => {
      router.push("/edit");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: "Request failed. Please try again.",
        variant: "destructive",
      });
    },
    onMutate: async () => {
      const response = await signIn("credentials", {
        email: email,
        password: password,
        redirect: true,
      });

      if (!response) {
        return new Error("Login failed");
      }
    },
  });

  return (
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
  );
};

export default Login;
