export function Footer() {
  return (
    <footer className="border-t py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
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
