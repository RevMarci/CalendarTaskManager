import Link from "next/link";

export default function SidebarItem({ href, label }: { href: string; label: string }) {
  return (
    <div className="mb-2">
      <Link href={href} className="block p-2 rounded hover:bg-gray-700">
        {label}
      </Link>
    </div>
  );
}