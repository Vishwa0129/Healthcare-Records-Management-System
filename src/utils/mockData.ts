import { 
  User, 
  Patient, 
  Doctor, 
  Admin, 
  MedicalRecord, 
  Appointment, 
  Prescription 
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'patient', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 'p2', name: 'Jane Smith', email: 'jane@example.com', role: 'patient', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 'd1', name: 'Dr. Sarah Johnson', email: 'sarah@example.com', role: 'doctor', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 'd2', name: 'Dr. Michael Chen', email: 'michael@example.com', role: 'doctor', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 'a1', name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'patient',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: {
      name: 'Mary Doe',
      relationship: 'Wife',
      phone: '555-123-4567',
    },
    insuranceDetails: {
      provider: 'HealthPlus',
      policyNumber: 'HP12345678',
      expiryDate: '2024-12-31',
    },
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'patient',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    bloodType: 'A-',
    allergies: ['Sulfa'],
    emergencyContact: {
      name: 'Robert Smith',
      relationship: 'Husband',
      phone: '555-987-6543',
    },
    insuranceDetails: {
      provider: 'MediCare',
      policyNumber: 'MC87654321',
      expiryDate: '2025-06-30',
    },
  },
];

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@example.com',
    role: 'doctor',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    specialization: 'Cardiology',
    licenseNumber: 'MD12345',
    yearsOfExperience: 10,
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      startTime: '09:00',
      endTime: '17:00',
    },
  },
  {
    id: 'd2',
    name: 'Dr. Michael Chen',
    email: 'michael@example.com',
    role: 'doctor',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    specialization: 'Neurology',
    licenseNumber: 'MD67890',
    yearsOfExperience: 15,
    availability: {
      days: ['Tuesday', 'Thursday'],
      startTime: '10:00',
      endTime: '18:00',
    },
  },
];

// Mock Admins
export const mockAdmins: Admin[] = [
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    department: 'System Administration',
    accessLevel: 'full',
  },
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'mr1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2023-02-15',
    diagnosis: 'Hypertension',
    treatment: 'Prescribed lisinopril 10mg daily',
    notes: 'Patient advised on diet modifications and regular exercise',
    attachments: [
      {
        id: 'att1',
        name: 'Blood Pressure Chart',
        type: 'document',
        url: '#',
        uploadDate: '2023-02-15',
      },
    ],
  },
  {
    id: 'mr2',
    patientId: 'p1',
    doctorId: 'd2',
    date: '2023-03-10',
    diagnosis: 'Migraine',
    treatment: 'Prescribed sumatriptan as needed',
    notes: 'Advised to maintain a headache diary',
    attachments: [
      {
        id: 'att2',
        name: 'MRI Report',
        type: 'report',
        url: '#',
        uploadDate: '2023-03-10',
      },
    ],
  },
  {
    id: 'mr3',
    patientId: 'p2',
    doctorId: 'd1',
    date: '2023-04-05',
    diagnosis: 'Seasonal Allergies',
    treatment: 'Prescribed cetirizine 10mg daily',
    attachments: [],
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'app1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2023-07-20',
    time: '10:30',
    status: 'scheduled',
    reason: 'Follow-up for hypertension',
    notes: 'Bring recent blood pressure readings',
  },
  {
    id: 'app2',
    patientId: 'p2',
    doctorId: 'd2',
    date: '2023-07-22',
    time: '14:15',
    status: 'scheduled',
    reason: 'Headache consultation',
  },
  {
    id: 'app3',
    patientId: 'p1',
    doctorId: 'd2',
    date: '2023-06-15',
    time: '11:00',
    status: 'completed',
    reason: 'Neurological evaluation',
    notes: 'Recommended follow-up in 3 months',
  },
  {
    id: 'app4',
    patientId: 'p2',
    doctorId: 'd1',
    date: '2023-06-10',
    time: '09:45',
    status: 'cancelled',
    reason: 'Annual check-up',
  },
];

// Mock Prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: 'presc1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2023-02-15',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '3 months',
        notes: 'Take in the morning',
      },
    ],
    instructions: 'Take with food. Monitor blood pressure weekly.',
    duration: '3 months',
    isRefillable: true,
  },
  {
    id: 'presc2',
    patientId: 'p1',
    doctorId: 'd2',
    date: '2023-03-10',
    medications: [
      {
        name: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed for migraine',
        duration: '6 months',
        notes: 'Do not exceed 2 tablets in 24 hours',
      },
    ],
    instructions: 'Take at first sign of migraine. Rest in a dark room.',
    duration: '6 months',
    isRefillable: false,
  },
  {
    id: 'presc3',
    patientId: 'p2',
    doctorId: 'd1',
    date: '2023-04-05',
    medications: [
      {
        name: 'Cetirizine',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '1 month',
      },
    ],
    instructions: 'Take as needed for allergy symptoms.',
    duration: '1 month',
    isRefillable: true,
  },
];

// Helper functions to retrieve related data
export const getPatientById = (id: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === id);
};

export const getDoctorById = (id: string): Doctor | undefined => {
  return mockDoctors.find(doctor => doctor.id === id);
};

export const getMedicalRecordsByPatientId = (patientId: string): MedicalRecord[] => {
  return mockMedicalRecords.filter(record => record.patientId === patientId);
};

export const getAppointmentsByPatientId = (patientId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.patientId === patientId);
};

export const getAppointmentsByDoctorId = (doctorId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getPrescriptionsByPatientId = (patientId: string): Prescription[] => {
  return mockPrescriptions.filter(prescription => prescription.patientId === patientId);
};