import { Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-semibold text-xl text-primary">SembrandoBits</h1>
        </div>
      </div>
    </header>
  );
}