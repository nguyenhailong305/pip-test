import LoginContainer from "@/containers/auth/login";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await supabase.auth.getUser();
      console.log(user , "aaaaaaaaaaaaaaaa")
      if (!user) {
        router.push("/");
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
