import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-full h-full bg-black text-white p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              to="/calendar" 
              className="block p-2 rounded hover:bg-gray-900 transition-colors"
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link 
              to="/task" 
              className="block p-2 rounded hover:bg-gray-900 transition-colors"
            >
              Task
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}