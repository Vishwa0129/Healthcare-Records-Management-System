// Define types for the Healthcare Records Management System

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  availability?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export interface Admin extends User {
  role: 'admin';
  department: string;
  accessLevel: 'full' | 'restricted';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  attachments?: Attachment[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: Medication[];
  instructions: string;
  duration: string;
  isRefillable: boolean;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'report' | 'image' | 'document';
  url: string;
  uploadDate: string;
}