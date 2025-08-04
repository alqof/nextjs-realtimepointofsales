import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-mute">
        <h1 className="text-xl mb-4"> Welcome to QopzKuy</h1>
        <Link href="/dashboard">
          <Button className="cursor-pointer"> Access to Dashboard</Button>
        </Link>
      </div>
      {/* <ThemeToggle/> */}
    </>
  );
}
