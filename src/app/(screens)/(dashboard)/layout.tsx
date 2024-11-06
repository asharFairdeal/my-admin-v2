
"use client";
import Menu from "@/components/Menu/Menu";
import Navbar from "@/components/Navbar/Navbar";
import withAuth from "../../../utils/authentication/withAuth";
import Image from "next/image";
import Link from "next/link";

 function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* {Left} */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-2">
        <Link
          href="/"
         className="flex items-center justify-center lg:justify-start gap-2"
        >

          <Image src='/logo.svg' alt='logo' width={32} height={32} />
          <span className="hidden lg:block font-bold">Fairdeal.Market</span>
        </Link>
        <Menu />
      </div>
      {/* {Right} */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]  overflow-scroll bg-white-100 flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default withAuth(DashboardLayout);