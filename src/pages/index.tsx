import Image from "next/image";
import { Inter } from "next/font/google";
import AuthLayout from "@/common/layout/AuthLayout";
import HomeContainer from "@/containers/cms/home";
import AppLayout from "@/common/layout/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <AuthLayout>
      <AppLayout>
        <HomeContainer />
      </AppLayout>
    </AuthLayout>
  );
}
