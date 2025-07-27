"use client";
import React, { useEffect, useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { useLoginMutation } from "../api/authApi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const isLoading=loginMutation.isPending;
  const { userData, setAuthData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loginMutation.status === "success") {
      setAuthData(loginMutation.data);
    }
  }, [loginMutation.status, loginMutation.data, setAuthData]);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      toast.success(res?.message || "Login Susscesful");
      router.push("/");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-2/5 font-roboto xl:w-1/4 p-6 sm:p-8 border-[var(--light-green)] border rounded-2xl space-y-4 shadow-md bg-white">
        <h2 className="text-2xl font-bold text-center text-[var(--color-pink-500)]">
          Log In
        </h2>

        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-3 w-full bg-gray-200 rounded focus:border-[var(--color-pink-600)] focus:outline-none border text-[var(--color-pink-500)]"
        />

        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-3 w-full bg-gray-200 rounded focus:border-[var(--color-pink-600)] focus:outline-none border text-[var(--color-pink-500)]"
        />

        <Button
          type="submit"
          className="bg-[var(--color-pink-500)] hover:bg-[var(--color-pink-600)] text-white py-2 px-6 mt-2 rounded cursor-pointer w-full"
        >
       { isLoading?"Log In...":" Log In"}
        </Button>
      </div>
    </form>
  );
}
