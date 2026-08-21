"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

export function DemoRoleSwitcher({ currentRole }: { currentRole: string }) {
  const router = useRouter();

  const handleRoleChange = (role: string) => {
    document.cookie = `demo_auth_role=${role}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="fixed bottom-20 right-6 z-[999] md:bottom-6">
      <Dropdown>
        <DropdownTrigger>
          <Button color="primary" variant="shadow" size="sm" className="font-bold shadow-cyan-500/50">
            Demo: {currentRole.replace("_", " ")}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Switch Role" onAction={(key) => handleRoleChange(key.toString())}>
          <DropdownItem key="SUPER_ADMIN">SUPER ADMIN</DropdownItem>
          <DropdownItem key="NAZIM">NAZIM (Principal)</DropdownItem>
          <DropdownItem key="USTAD">USTAD (Teacher)</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
