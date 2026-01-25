import { Search, Sun, Moon, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Markets", href: "#", active: true },
  { label: "Portfolio", href: "#" },
  { label: "Insights", href: "#" },
];

export function Header() {
  return (
    <header className="w-full pt-8">
      <div className="mx-auto max-w-7xl bg-[#2B313F] rounded-[45px] px-3">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img
                src="/logo-dark.svg"
                alt="Orbit"
                className="h-8 w-auto"
              />
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.active
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Section: Search + Theme + User + Login */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="w-32 lg:w-40 pl-9 h-9 bg-[#222733] border-transparent text-white placeholder:text-gray-400 rounded-full focus-visible:ring-0 focus-visible:border-transparent"
              />
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center bg-[#222733] rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-transparent"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 h-9 bg-[#222733] rounded-full text-white hover:bg-[#2a3142] hover:text-white"
                >
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">EH</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Button */}
            <Button className="h-9 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium">
              Log in
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
