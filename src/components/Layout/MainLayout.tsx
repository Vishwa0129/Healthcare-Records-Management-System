import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  ActivitySquare,
  Calendar,
  ClipboardList,
  Home,
  LogOut,
  Settings,
  User,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      { to: '/dashboard', icon: <Home size={20} />, text: 'Dashboard' },
      { to: '/profile', icon: <User size={20} />, text: 'Profile' },
      { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    ];

    if (user?.role === 'patient') {
      return [
        ...commonLinks,
        { to: '/medical-records', icon: <ClipboardList size={20} />, text: 'Medical Records' },
        { to: '/appointments', icon: <Calendar size={20} />, text: 'Appointments' },
        { to: '/prescriptions', icon: <ActivitySquare size={20} />, text: 'Prescriptions' },
      ];
    } else if (user?.role === 'doctor') {
      return [
        ...commonLinks,
        { to: '/patients', icon: <Users size={20} />, text: 'Patients' },
        { to: '/appointments', icon: <Calendar size={20} />, text: 'Appointments' },
        { to: '/prescriptions', icon: <ActivitySquare size={20} />, text: 'Prescriptions' },
      ];
    } else if (user?.role === 'admin') {
      return [
        ...commonLinks,
        { to: '/manage-users', icon: <Users size={20} />, text: 'Manage Users' },
        { to: '/system-logs', icon: <ClipboardList size={20} />, text: 'System Logs' },
      ];
    }

    return commonLinks;
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">HealthRecord</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`
                }
              >
                <span className="mr-3">{link.icon}</span>
                {link.text}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h1 className="ml-2 text-xl font-bold text-blue-600 md:hidden">HealthRecord</h1>
              </div>
              
              <div className="flex items-center ml-auto">
                <div className="ml-3 relative flex items-center">
                  <div className="flex items-center">
                    <span className="hidden md:block mr-4 text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <User size={20} className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex flex-col w-full max-w-xs bg-white h-full">
              <div className="flex-1 overflow-y-auto pt-5 pb-4">
                <div className="flex items-center justify-between px-4">
                  <h1 className="text-xl font-bold text-blue-600">HealthRecord</h1>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                  >
                    <X size={24} />
                  </button>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }`
                      }
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.text}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;