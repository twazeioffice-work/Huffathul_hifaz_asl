"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen, Compass, GraduationCap, Phone, Info } from "lucide-react";
import { Button } from "./ui/Button";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "About", icon: Info },
    { href: "/directory/courses", label: "Curriculum", icon: BookOpen },
    { href: "/directory/institutions", label: "Campuses", icon: Compass },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-3 focus-ring rounded-sm">
          <div className="h-9 w-9 rounded bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg shadow-sm">
            SH
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base font-bold tracking-tight text-foreground leading-tight">
              Suffat-ul Huffaz
            </span>
            <span className="text-[10px] text-muted tracking-wider uppercase">
              Digital Educational Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-sm px-1 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <Link href="/admission">
            <Button size="sm" className="font-semibold">
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Apply Online
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground focus-ring rounded"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-100 hover:text-foreground"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link href="/admission" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Apply Online
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
