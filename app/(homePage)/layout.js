import "./globals.css";
import NavBar from '@/app/(homePage)/_components/navBar/navBar'
import SearchInput from "@/app/(homePage)/_components/inputs/searchInput";
import { headers } from "next/headers";

export default async function RootLayout({ children }) {

  const ua = await headers().get('user-agent') ?? ''
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)

  if (!isMobile) {
    return (<p>Application for computers is not Available yet!</p>)
  }


  return (
    <>
      <SearchInput></SearchInput>
      <div className="frame">
        {children}
      </div>
      <NavBar />
    </>
  );
}
