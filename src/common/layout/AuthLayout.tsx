import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
          router.push("/auth/login");
        } else {
          setUser(data);
      
        }
      } catch (error) {
        router.push("/logout");
      }
    };

    verifyUser();
  }, []);

  if (user) {
    return (
      <div >
        <main className="min-h-[360px] p-6 bg-slate-400">{children}</main>
      </div>
    );
  }

  return null;
}
