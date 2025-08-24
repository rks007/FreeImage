
import Navbar from "@/components/navbar/Navbar";
import SearchBar from "@/components/search/SearchBar";
import ShowImages from "@/components/showImages/ShowImages";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-10 font-sans">
    {/* Navbar */}
      <header className="w-full max-w-6xl mb-9">
        <Navbar />
      </header>

    {/* Search Bar */}
      <main className="w-full max-w-3xl">
        <SearchBar />
      </main>

    {/* Image Gallery */}
      <div>
        <ShowImages/>
      </div>
      
    </div>
  );
}
