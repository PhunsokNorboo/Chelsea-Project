import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/squad", label: "Squad" },
  { href: "/news", label: "News" },
  { href: "/standings", label: "Standings" },
];

export function Footer() {
  return (
    <footer className="border-t py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <nav className="flex justify-center gap-4 mb-4">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p>
          Data provided by{" "}
          <a
            href="https://www.football-data.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            football-data.org
          </a>
        </p>
        <p className="mt-1">Not affiliated with Chelsea Football Club.</p>
      </div>
    </footer>
  );
}
