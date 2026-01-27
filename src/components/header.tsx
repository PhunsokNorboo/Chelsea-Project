import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-chelsea-blue text-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-chelsea-blue font-bold text-sm">
            CFC
          </div>
          <span className="font-bold text-lg hidden sm:inline">
            Chelsea FC Fixtures
          </span>
          <span className="font-bold text-lg sm:hidden">Chelsea FC</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
