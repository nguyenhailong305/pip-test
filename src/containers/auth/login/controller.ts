import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleLogin = async (
    type: string,
    username: string,
    password: string
  ) => {
    try {
      const {
        error,
        data: { user },
      } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({
              email: username,
              password,
            })
          : await supabase.auth.signUp({ email: username, password });
      if (error) {
        alert("Error with auth: " + error.message);
      } else if (!user)
        alert("Signup successful, confirmation mail should be sent soon!");
        
      router.push("/");
    } catch (error: any) {
      console.log("error", error);
      alert(error.error_description || error);
    }
  };

  return { username, setUsername, password, setPassword, handleLogin };
};
