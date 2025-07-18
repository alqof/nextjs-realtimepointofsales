import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <ThemeToggle/>
      <Input/>
      <Button> Test </Button>
    </>
  );
}
