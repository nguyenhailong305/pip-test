import Image from "next/image";
import { Inter } from "next/font/google";
import AuthLayout from "@/common/layout/AuthLayout";
import HomeContainer from "@/containers/cms/home";
import AppLayout from "@/common/layout/AppLayout";
import { supabase } from "@/utils/supabase";

const inter = Inter({ subsets: ["latin"] });
const session = supabase.auth.getSession();
export default function Home() {
  return (
    <AuthLayout>
      <AppLayout>
        <HomeContainer session={session} />
      </AppLayout>
    </AuthLayout>
  );
}
