import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <SidebarItem href="/calendar" label="Calendar" />
      <SidebarItem href="/task" label="task" />
    </aside>
  );
}