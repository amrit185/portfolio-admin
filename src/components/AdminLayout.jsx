import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
// import { LayoutDashboard, FolderKanban, Code, LogOut } from 'lucide-react';
import { LayoutDashboard, FolderKanban, Code, FileText, User, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

 const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'About Me', path: '/about', icon: <User size={20} /> },
  { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
  { name: 'Skills', path: '/skills', icon: <Code size={20} /> },
  { name: 'Blogs', path: '/blogs', icon: <FileText size={20} /> },
];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">CMS Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> {/* This renders the current page */}
      </main>
    </div>
  );
}