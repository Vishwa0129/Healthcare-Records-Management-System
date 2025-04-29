import React from 'react';
import { Users, Activity, Shield, AlertTriangle, Server, Search, ChevronRight } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import { mockUsers, mockPatients, mockDoctors } from '../../utils/mockData';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Input
            placeholder="Search users..."
            leftIcon={<Search size={18} className="text-gray-400" />}
            className="w-64"
          />
          <Button variant="primary">System Settings</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={mockUsers.length.toString()}
          icon={<Users className="h-12 w-12 text-blue-500" />}
          change="+8 from last month"
          trend="up"
        />
        <StatsCard
          title="Active Patients"
          value={mockPatients.length.toString()}
          icon={<Activity className="h-12 w-12 text-green-500" />}
          change="+3 from last month"
          trend="up"
        />
        <StatsCard
          title="Security Alerts"
          value="2"
          icon={<Shield className="h-12 w-12 text-yellow-500" />}
          change="-1 from last week"
          trend="down"
        />
        <StatsCard
          title="System Health"
          value="99.8%"
          icon={<Server className="h-12 w-12 text-purple-500" />}
          change="Same as last week"
          trend="neutral"
        />
      </div>

      {/* Security Alerts */}
      <Card 
        title="Security Alerts" 
        headerAction={<Button variant="text" size="sm">View All Alerts</Button>}
      >
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Failed Login Attempts</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Multiple failed login attempts detected from IP 192.168.1.105</p>
                </div>
                <div className="mt-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      3 attempts
                    </span>
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      8 minutes ago
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Unusual Access Pattern</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Unusual access pattern detected for user ID: d2</p>
                </div>
                <div className="mt-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      High severity
                    </span>
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      2 hours ago
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent User Activities */}
        <Card 
          title="User Activities" 
          headerAction={<Button variant="text" size="sm">View All</Button>}
        >
          <div className="space-y-4">
            {[
              { id: 1, user: mockDoctors[0], action: 'Updated patient record', time: '10 minutes ago' },
              { id: 2, user: mockPatients[0], action: 'Scheduled an appointment', time: '1 hour ago' },
              { id: 3, user: mockDoctors[1], action: 'Created new prescription', time: '3 hours ago' },
              { id: 4, user: mockPatients[1], action: 'Downloaded medical report', time: '5 hours ago' },
            ].map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Avatar 
                  src={activity.user.avatar} 
                  name={activity.user.name} 
                  size="sm" 
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.user.name}</h4>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Logs */}
        <Card 
          title="System Logs" 
          headerAction={<Button variant="text" size="sm">View All</Button>}
        >
          <div className="space-y-2">
            {[
              { id: 1, type: 'info', message: 'Database backup completed successfully', time: '2 hours ago' },
              { id: 2, type: 'warning', message: 'Storage usage at 82% capacity', time: '6 hours ago' },
              { id: 3, type: 'info', message: 'System updates installed successfully', time: '1 day ago' },
              { id: 4, type: 'error', message: 'API rate limit exceeded - external service', time: '1 day ago' },
              { id: 5, type: 'info', message: 'Automated security scan completed', time: '2 days ago' },
            ].map((log) => (
              <div key={log.id} className="flex items-start p-2 hover:bg-gray-50 rounded">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-2 w-2 rounded-full ${
                    log.type === 'info' ? 'bg-blue-500' :
                    log.type === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-700">{log.message}</p>
                    <p className="text-xs text-gray-500">{log.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Management */}
      <Card 
        title="User Management" 
        headerAction={<Button variant="primary" size="sm">Add New User</Button>}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.slice(0, 5).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={
                        user.role === 'doctor' ? 'primary' :
                        user.role === 'admin' ? 'secondary' :
                        'info'
                      }
                      rounded
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="success" rounded>Active</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {['2 minutes ago', '1 hour ago', '5 hours ago', '1 day ago', '3 days ago'][Math.floor(Math.random() * 5)]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="text" 
                      size="sm"
                      rightIcon={<ChevronRight size={16} />}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, trend }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'neutral':
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">{icon}</div>
        <div className="ml-5">
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      <p className={`mt-3 text-sm ${getTrendColor()}`}>{change}</p>
    </div>
  );
};

export default AdminDashboard;