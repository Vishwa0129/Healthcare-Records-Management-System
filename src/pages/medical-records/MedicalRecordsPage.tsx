import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Upload } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getMedicalRecordsByPatientId,
  getDoctorById
} from '../../utils/mockData';
import { MedicalRecord } from '../../types';

const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.id || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Get all records
  const allRecords = getMedicalRecordsByPatientId(patientId);
  
  // Apply search and filters
  const filteredRecords = allRecords.filter(record => {
    const matchesSearch = !searchTerm || 
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = !activeFilter || 
      (activeFilter === 'has-attachments' && record.attachments && record.attachments.length > 0);
    
    return matchesSearch && matchesFilter;
  });

  // Group records by year
  const recordsByYear = filteredRecords.reduce<Record<string, MedicalRecord[]>>((acc, record) => {
    const year = new Date(record.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(record);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(recordsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3">
          <Button 
            variant="outline" 
            leftIcon={<Upload size={16} />}
            className="mb-2 sm:mb-0"
          >
            Upload Record
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Download size={16} />}
          >
            Download All
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Input
          placeholder="Search by diagnosis, treatment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} className="text-gray-400" />}
          className="w-full sm:w-80"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={18} className="text-gray-500" />
          <Badge 
            variant={activeFilter === 'has-attachments' ? 'primary' : 'default'} 
            rounded
            className="cursor-pointer"
            onClick={() => setActiveFilter(activeFilter === 'has-attachments' ? null : 'has-attachments')}
          >
            Has Attachments
          </Badge>
          {activeFilter && (
            <Button 
              variant="text" 
              size="sm" 
              onClick={() => setActiveFilter(null)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Records listing */}
      <div className="space-y-8">
        {sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <div key={year}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{year}</h2>
              <div className="space-y-4">
                {recordsByYear[year].map((record) => {
                  const doctor = getDoctorById(record.doctorId);
                  return (
                    <Card key={record.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h3 className="text-lg font-medium text-gray-900">{record.diagnosis}</h3>
                                <span className="ml-3 text-sm text-gray-500">{formatDate(record.date)}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Treatment:</span> {record.treatment}
                              </p>
                              {record.notes && (
                                <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                              )}
                              {record.attachments && record.attachments.length > 0 && (
                                <div className="mt-3">
                                  <span className="text-xs font-medium text-gray-500">ATTACHMENTS</span>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    {record.attachments.map((attachment) => (
                                      <Badge key={attachment.id} variant="info" size="sm">
                                        {attachment.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-end justify-between">
                          <div className="flex items-center">
                            {doctor && (
                              <>
                                <span className="text-sm text-gray-500 mr-2">Doctor:</span>
                                <div className="flex items-center">
                                  <Avatar 
                                    src={doctor.avatar} 
                                    name={doctor.name} 
                                    size="sm" 
                                  />
                                  <span className="ml-2 text-sm font-medium text-gray-700">{doctor.name}</span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
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
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || activeFilter 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Your medical records will appear here once they\'ve been added by your healthcare provider.'}
            </p>
            {(searchTerm || activeFilter) && (
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter(null);
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

// Helper to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default MedicalRecordsPage;