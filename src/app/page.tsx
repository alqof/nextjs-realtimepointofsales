import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="bg-mute">
        <h1 className="text-xl"> Welcome to QopzKuy</h1>
        <Link href="/admin">
        <Button className="cursor-pointer"> Access to Dashboard</Button>
        </Link>
      </div>
      {/* <ThemeToggle/> */}
    </>
  );
}
