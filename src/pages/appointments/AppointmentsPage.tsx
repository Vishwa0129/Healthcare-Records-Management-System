import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search, Plus, CalendarDays } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAppointmentsByPatientId, 
  getAppointmentsByDoctorId,
  getDoctorById,
  getPatientById
} from '../../utils/mockData';
import { Appointment } from '../../types';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get appointments based on user role
  const appointments = user?.role === 'doctor' 
    ? getAppointmentsByDoctorId(user.id) 
    : getAppointmentsByPatientId(user.id);

  // Apply filters
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by status
    if (filter === 'upcoming') {
      return appointment.status === 'scheduled';
    } else if (filter === 'past') {
      return appointment.status === 'completed' || appointment.status === 'cancelled';
    }

    // Search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const patient = getPatientById(appointment.patientId);
      const doctor = getDoctorById(appointment.doctorId);
      
      return (
        appointment.reason.toLowerCase().includes(lowerSearch) ||
        appointment.date.includes(lowerSearch) ||
        appointment.time.includes(lowerSearch) ||
        (patient && patient.name.toLowerCase().includes(lowerSearch)) ||
        (doctor && doctor.name.toLowerCase().includes(lowerSearch))
      );
    }

    return true;
  });

  // Group appointments by month
  const appointmentsByMonth = filteredAppointments.reduce<Record<string, Appointment[]>>((acc, appointment) => {
    const date = new Date(appointment.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(appointment);
    
    return acc;
  }, {});

  // Sort appointments within each month by date (most recent first)
  Object.keys(appointmentsByMonth).forEach(month => {
    appointmentsByMonth[month].sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB.getTime() - dateA.getTime();
    });
  });

  // Sort months (most recent first)
  const sortedMonths = Object.keys(appointmentsByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={16} />}
          className="mt-4 sm:mt-0"
        >
          Schedule New Appointment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} className="text-gray-400" />}
          className="w-full sm:w-64"
        />
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'upcoming'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'past'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          leftIcon={<CalendarDays size={16} />}
        >
          Calendar View
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-8">
        {sortedMonths.length > 0 ? (
          sortedMonths.map(month => (
            <div key={month}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{month}</h2>
              <div className="space-y-4">
                {appointmentsByMonth[month].map(appointment => {
                  const patient = getPatientById(appointment.patientId);
                  const doctor = getDoctorById(appointment.doctorId);
                  const isPast = new Date(appointment.date) < new Date();
                  
                  return (
                    <Card 
                      key={appointment.id} 
                      className={`hover:shadow-md transition-shadow ${
                        appointment.status === 'cancelled' ? 'opacity-70' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="flex items-start">
                          {/* Date column */}
                          <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                            <span className="text-sm font-semibold text-blue-700">
                              {new Date(appointment.date).toLocaleDateString('en-US', { day: '2-digit' })}
                            </span>
                            <span className="text-xs text-blue-600">
                              {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                          </div>

                          {/* Details column */}
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900">{appointment.reason}</h3>
                              <AppointmentStatusBadge status={appointment.status} />
                            </div>
                            
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <Clock size={16} className="mr-1" />
                              <span>{appointment.time}</span>
                              
                              {user?.role === 'patient' && doctor && (
                                <div className="ml-6 flex items-center">
                                  <User user={doctor} />
                                </div>
                              )}
                              
                              {user?.role === 'doctor' && patient && (
                                <div className="ml-6 flex items-center">
                                  <User user={patient} />
                                </div>
                              )}
                            </div>
                            
                            {appointment.notes && (
                              <p className="mt-2 text-sm text-gray-500">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions column */}
                        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                          {appointment.status === 'scheduled' && (
                            <>
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                              <Button 
                                variant={isPast ? "primary" : "outline"} 
                                size="sm"
                              >
                                {isPast ? 'Check In' : 'Cancel'}
                              </Button>
                            </>
                          )}
                          {appointment.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              View Summary
                            </Button>
                          )}
                          {appointment.status === 'cancelled' && (
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filters to find appointments.'
                : 'Schedule your first appointment to get started with your healthcare journey.'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface UserProps {
  user: { name: string; avatar?: string; specialization?: string; };
}

const User: React.FC<UserProps> = ({ user }) => (
  <>
    <Avatar src={user.avatar} name={user.name} size="sm" />
    <div className="ml-2">
      <span className="text-sm font-medium text-gray-700">{user.name}</span>
      {user.specialization && (
        <span className="text-xs text-gray-500 block">{user.specialization}</span>
      )}
    </div>
  </>
);

interface AppointmentStatusBadgeProps {
  status: string;
}

const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'scheduled':
      return <Badge variant="primary" rounded className="ml-2">Scheduled</Badge>;
    case 'completed':
      return <Badge variant="success" rounded className="ml-2">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="danger" rounded className="ml-2">Cancelled</Badge>;
    default:
      return <Badge variant="default" rounded className="ml-2">{status}</Badge>;
  }
};

export default AppointmentsPage;