import { Users, Package, FileBarChart, Settings, HelpCircle, Bell, LogOut } from 'lucide-react';

interface MoreProps {
  username: string;
  onLogout: () => void;
}

export function More({ username, onLogout }: MoreProps) {
  const menuItems = [
    { icon: Users, label: 'Clients', color: 'bg-blue-100 text-blue-600', count: '0' },
    { icon: Package, label: 'Materials', color: 'bg-purple-100 text-purple-600', count: '0' },
    { icon: FileBarChart, label: 'Reports', color: 'bg-green-100 text-green-600', count: '' },
    { icon: Bell, label: 'Notifications', color: 'bg-amber-100 text-amber-600', count: '0' },
    { icon: Settings, label: 'Settings', color: 'bg-gray-100 text-gray-600', count: '' },
    { icon: HelpCircle, label: 'Help & Support', color: 'bg-indigo-100 text-indigo-600', count: '' }
  ];

  // Get user initials
  const initials = username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-b-3xl md:rounded-3xl shadow-lg">
        <h1 className="text-2xl mb-1">More</h1>
        <p className="text-gray-300 text-sm">Additional features & settings</p>
      </div>

      {/* Profile Section */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-lg text-gray-900">{username}</h2>
              <p className="text-sm text-gray-500">Contractor & Builder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-gray-900">{item.label}</div>
                </div>
                {item.count && (
                  <div className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
                    {item.count}
                  </div>
                )}
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4">
        <button 
          onClick={onLogout}
          className="w-full bg-white rounded-2xl p-4 shadow-md border border-red-200 hover:bg-red-50 active:bg-red-100 transition-colors"
        >
          <div className="flex items-center justify-center gap-2 text-red-600">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="px-4 text-center text-sm text-gray-400">
        <p>Contractor Manager v1.0.0</p>
        <p className="text-xs mt-1">© 2026 All rights reserved</p>
      </div>
    </div>
  );
}