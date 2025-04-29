import React from 'react';
import { Calendar, Clock, Activity, User, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { 
  getAppointmentsByPatientId, 
  getMedicalRecordsByPatientId,
  getPrescriptionsByPatientId,
  getDoctorById
} from '../../utils/mockData';
import { Doctor } from '../../types';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.id || '';

  // Get patient data
  const appointments = getAppointmentsByPatientId(patientId);
  const upcomingAppointments = appointments.filter(app => app.status === 'scheduled');
  const medicalRecords = getMedicalRecordsByPatientId(patientId);
  const prescriptions = getPrescriptionsByPatientId(patientId);

  // Get doctors
  const doctorsMap = new Map<string, Doctor>();
  appointments.forEach(app => {
    const doctor = getDoctorById(app.doctorId);
    if (doctor) doctorsMap.set(doctor.id, doctor);
  });
  const doctors = Array.from(doctorsMap.values());

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <Button variant="primary">
          Schedule Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length.toString()}
          icon={<Calendar className="h-12 w-12 text-blue-500" />}
          change="+1 from last month"
          trend="up"
        />
        <StatsCard
          title="Medical Records"
          value={medicalRecords.length.toString()}
          icon={<FileText className="h-12 w-12 text-indigo-500" />}
          change="+2 from last month"
          trend="up"
        />
        <StatsCard
          title="Active Prescriptions"
          value={prescriptions.length.toString()}
          icon={<Activity className="h-12 w-12 text-cyan-500" />}
          change="Same as last month"
          trend="neutral"
        />
        <StatsCard
          title="Your Doctors"
          value={doctors.length.toString()}
          icon={<User className="h-12 w-12 text-teal-500" />}
          change="+1 from last month"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card title="Upcoming Appointments" headerAction={
          <Button variant="text" size="sm">View All</Button>
        }>
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 3).map((appointment) => {
                const doctor = getDoctorById(appointment.doctorId);
                return (
                  <div key={appointment.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Avatar 
                        src={doctor?.avatar} 
                        name={doctor?.name} 
                        size="lg" 
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-900">{doctor?.name}</h4>
                        {getAppointmentStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-500">{doctor?.specialization}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-1" />
                        <span>{appointment.date}</span>
                        <Clock size={16} className="ml-3 mr-1" />
                        <span>{appointment.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{appointment.reason}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No upcoming appointments</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Schedule an appointment
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Medical Records */}
        <Card title="Recent Medical Records" headerAction={
          <Button variant="text" size="sm">View All</Button>
        }>
          <div className="space-y-4">
            {medicalRecords.length > 0 ? (
              medicalRecords.slice(0, 3).map((record) => {
                const doctor = getDoctorById(record.doctorId);
                return (
                  <div key={record.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex justify-between">
                      <h4 className="text-base font-medium text-gray-900">{record.diagnosis}</h4>
                      <span className="text-sm text-gray-500">{record.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Dr. {doctor?.name?.split(' ')[1]}</p>
                    <p className="text-sm text-gray-600 mt-2">{record.treatment}</p>
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{record.notes}"</p>
                    )}
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="mt-2 flex items-center">
                        <FileText size={16} className="text-blue-500" />
                        <span className="ml-1 text-sm text-blue-600">
                          {record.attachments.length} attachment{record.attachments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No medical records found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Your Doctors */}
      <Card title="Your Care Team" headerAction={
        <Button variant="text" size="sm">View All</Button>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <Avatar 
                src={doctor.avatar} 
                name={doctor.name} 
                size="xl" 
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-500">{doctor.specialization}</p>
              <p className="mt-1 text-xs text-gray-500">{doctor.yearsOfExperience} years experience</p>
              <div className="mt-4 flex space-x-2">
                <Button size="sm" variant="outline">Message</Button>
                <Button size="sm" variant="primary">Appointment</Button>
              </div>
            </div>
          ))}
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

export default PatientDashboard;