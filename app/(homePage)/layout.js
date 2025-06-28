import "./globals.css";
import NavBar from '@/app/(homePage)/_components/navBar/navBar'
import SearchInput from "@/app/(homePage)/_components/inputs/searchInput";

export default async function RootLayout({ children }) {

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
