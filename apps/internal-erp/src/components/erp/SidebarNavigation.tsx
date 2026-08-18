import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, UserCircle, Settings } from "lucide-react";

export function SidebarNavigation({
  institutionCode,
  branchCode,
}: {
  institutionCode: string;
  branchCode: string;
}) {
  const basePath = `/app/${institutionCode}/${branchCode}/erp`;

  const navItems = [
    { label: "Dashboard", href: basePath, icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Student Roster", href: `${basePath}/students`, icon: <Users className="h-5 w-5" /> },
    { label: "Staff Directory", href: `${basePath}/staff`, icon: <UserCircle className="h-5 w-5" /> },
    { label: "Academics", href: `${basePath}/academic`, icon: <BookOpen className="h-5 w-5" /> },
    { label: "Settings", href: `${basePath}/settings`, icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <ul className="space-y-1 px-3">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
