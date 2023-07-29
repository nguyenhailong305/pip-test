import LoginContainer from "@/containers/auth/login";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      }
    };

    checkUser();
  }, []);

  return (
    <div>
      <LoginContainer />
    </div>
  );
}
