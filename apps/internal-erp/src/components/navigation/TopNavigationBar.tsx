"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Chip
} from "@heroui/react";

interface TopNavigationBarProps {
  institutionCode: string;
  branchCode: string;
  currentTenantName: string;
  userRole: "SUPER_ADMIN" | "NAZIM" | "USTAD";
  userName: string;
  userEmail: string;
}

export function TopNavigationBar({
  institutionCode,
  branchCode,
  currentTenantName,
  userRole,
  userName,
  userEmail,
}: TopNavigationBarProps) {
  const pathname = usePathname();
  const basePath = `/app/${institutionCode}/${branchCode}/erp`;

  const navLinks = [
    { name: "Command Center", href: `${basePath}`, roles: ["SUPER_ADMIN", "NAZIM", "USTAD"] },
    { name: "Students", href: `${basePath}/students`, roles: ["SUPER_ADMIN", "NAZIM", "USTAD"] },
    { name: "Academics", href: `${basePath}/academics`, roles: ["SUPER_ADMIN", "NAZIM", "USTAD"] },
    { name: "Staff", href: `${basePath}/staff`, roles: ["SUPER_ADMIN", "NAZIM"] },
    { name: "Billing", href: `${basePath}/billing`, roles: ["SUPER_ADMIN", "NAZIM"] },
    { name: "Ledger", href: `${basePath}/ledger`, roles: ["SUPER_ADMIN", "NAZIM"] },
    { name: "Assets & Fleet", href: `${basePath}/assets`, roles: ["SUPER_ADMIN"] },
    { name: "Reports", href: `${basePath}/reports`, roles: ["SUPER_ADMIN", "NAZIM"] },
  ];

  return (
    <Navbar
      isBordered
      maxWidth="xl"
      className="apple-glass-panel border-b border-border/40 py-1"
    >
      <NavbarBrand>
        <Link href={basePath} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-black font-extrabold text-sm tracking-tighter">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white leading-tight">Suffat-ul Huffaz</span>
            <span className="text-xs text-muted-foreground font-mono">{currentTenantName}</span>
          </div>
        </Link>
      </NavbarBrand>

      {/* Main Navigation Links */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {navLinks.map((link) => {
          if (!link.roles.includes(userRole)) return null;
          const isActive = link.href === basePath
            ? pathname === basePath || pathname === basePath + "/"
            : pathname.startsWith(link.href);
          return (
            <NavbarItem key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-semibold tracking-tight transition-all duration-200 py-2 px-1 relative ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* User Actions & Role Badges */}
      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden sm:flex">
          <Chip
            size="sm"
            variant="flat"
            className={`${
              userRole === "SUPER_ADMIN"
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : userRole === "NAZIM"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {userRole.replace("_", " ")}
          </Chip>
        </NavbarItem>

        <Dropdown placement="bottom-end" className="apple-glass-panel">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform ring-primary/40"
              color="primary"
              name={userName}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2 text-white">
              <p className="font-semibold text-xs text-muted-foreground">Signed in as</p>
              <p className="font-bold text-sm text-primary">{userEmail}</p>
            </DropdownItem>
            <DropdownItem key="settings" className="text-muted-foreground hover:text-white">My Settings</DropdownItem>
            <DropdownItem key="team_settings" className="text-muted-foreground hover:text-white">Center Settings</DropdownItem>
            <DropdownItem key="logout" color="danger" className="text-danger hover:bg-danger/10">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
