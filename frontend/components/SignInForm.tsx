"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import CustomInput from "./CustomInput";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { SignInSchema } from "@/lib/validation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = async (data: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);
    try {
      const res = (await api.auth.signIn(data)) as ActionResponse;

      if (res.success) {
        toast("Success", { description: "เข้าสู่ระบบสำเร็จ" });

        const destination = callbackUrl || ROUTES.HOME;

        router.push(destination);
        return;
      }

      throw new Error(res.error?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast("เกิดข้อผิดพลาด", {
        description:
          error?.message || "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่ภายหลัง",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl sm:text-3xl text-gray-900">
          Sign in
        </h1>
        <p className="text-gray-500 text-md font-semibold">
          Please enter your details
        </p>
      </section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <CustomInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
          />

          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="text-[16px] rounded-lg border font-semibold text-white shadow-form h-12 cursor-pointer bg-blue-gradient"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <footer className="flex justify-center gap-1">
        <p className="text-[14px] font-normal text-gray-600">
          Don&apos; t have an account?
        </p>
        <Link
          href={
            callbackUrl
              ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : "/sign-up"
          }
          className="text-[14px] cursor-pointer font-medium text-blue-600"
        >
          Sign up
        </Link>
      </footer>
    </>
  );
};

export default SignInForm;
