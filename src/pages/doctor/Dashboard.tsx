import React from 'react';
import { Clock, Calendar, Users, Activity, ChevronRight, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import { 
  getAppointmentsByDoctorId, 
  getPatientById
} from '../../utils/mockData';
import { Appointment } from '../../types';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const doctorId = user?.id || '';

  // Get appointments
  const appointments = getAppointmentsByDoctorId(doctorId);
  const todayAppointments = appointments.filter(
    app => app.status === 'scheduled' && new Date(app.date).toDateString() === new Date().toDateString()
  );
  const upcomingAppointments = appointments.filter(
    app => app.status === 'scheduled' && new Date(app.date) > new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <div className="flex space-x-4">
          <Input
            placeholder="Search patients..."
            leftIcon={<Search size={18} className="text-gray-400" />}
            className="w-64"
          />
          <Button variant="primary">Add Patient</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments.length.toString()}
          icon={<Clock className="h-12 w-12 text-blue-500" />}
          change="+1 from yesterday"
          trend="up"
        />
        <StatsCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length.toString()}
          icon={<Calendar className="h-12 w-12 text-indigo-500" />}
          change="+2 from last week"
          trend="up"
        />
        <StatsCard
          title="Total Patients"
          value="24"
          icon={<Users className="h-12 w-12 text-cyan-500" />}
          change="+3 from last month"
          trend="up"
        />
        <StatsCard
          title="Prescriptions Written"
          value="18"
          icon={<Activity className="h-12 w-12 text-teal-500" />}
          change="+5 from last month"
          trend="up"
        />
      </div>

      {/* Today's Schedule */}
      <Card title="Today's Schedule">
        <div className="space-y-4">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h3>
              <p className="mt-1 text-sm text-gray-500">Enjoy your free time or catch up on patient records.</p>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card title="Upcoming Appointments" headerAction={
          <Button variant="text" size="sm">View All</Button>
        }>
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 4).map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} compact />
            ))}
          </div>
        </Card>

        {/* Recent Patients */}
        <Card title="Recent Patients" headerAction={
          <Button variant="text" size="sm">View All</Button>
        }>
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment) => {
              const patient = getPatientById(appointment.patientId);
              if (!patient) return null;
              
              return (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Avatar src={patient.avatar} name={patient.name} size="md" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{patient.name}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{patient.gender}, {calculateAge(patient.dateOfBirth)}</span>
                        <span className="mx-2">•</span>
                        <span>Blood: {patient.bloodType}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    rightIcon={<ChevronRight size={16} />}
                  >
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
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

interface AppointmentItemProps {
  appointment: Appointment;
  compact?: boolean;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, compact = false }) => {
  const patient = getPatientById(appointment.patientId);
  
  if (!patient) return null;

  // Status badge logic
  const getAppointmentStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="primary" rounded>Scheduled</Badge>;
      case 'completed':
        return <Badge variant="success" rounded>Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger" rounded>Cancelled</Badge>;
      default:
        return <Badge variant="default" rounded>{status}</Badge>;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <Avatar src={patient.avatar} name={patient.name} size="sm" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">{patient.name}</h4>
            <div className="flex items-center text-xs text-gray-500 mt-0.5">
              <Calendar size={12} className="mr-1" />
              <span>{appointment.date}</span>
              <Clock size={12} className="ml-2 mr-1" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getAppointmentStatusBadge(appointment.status)}
          <Button variant="outline" size="sm">Details</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Avatar src={patient.avatar} name={patient.name} size="lg" />
        </div>
        <div className="ml-4">
          <div className="flex items-center">
            <h4 className="text-base font-medium text-gray-900">{patient.name}</h4>
            <span className="ml-2">{getAppointmentStatusBadge(appointment.status)}</span>
          </div>
          <p className="text-sm text-gray-500">{patient.gender}, {calculateAge(patient.dateOfBirth)} • Blood: {patient.bloodType}</p>
          <div className="mt-2 flex items-center text-sm text-gray-700">
            <Clock size={16} className="mr-1 text-gray-500" />
            <span>{appointment.time}</span>
            <span className="mx-2">•</span>
            <span>{appointment.reason}</span>
          </div>
          {appointment.notes && <p className="mt-1 text-xs text-gray-500">{appointment.notes}</p>}
        </div>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-2 sm:ml-4">
        <Button variant="outline" size="sm">Reschedule</Button>
        <Button variant="primary" size="sm">Start Session</Button>
      </div>
    </div>
  );
};

// Helper function to calculate age from birthdate
const calculateAge = (birthdate: string): number => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default DoctorDashboard;