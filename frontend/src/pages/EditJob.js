import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { 
  Building, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar,
  FileText,
  ArrowLeft,
  Save,
  Trash2
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';

const EditJob = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    jobId: '',
    companyName: '',
    email: '',
    status: 'applied',
    roundNumber: 1,
    position: '',
    location: '',
    salary: '',
    notes: '',
    jobDescription: '',
    resume: '',
    excitementIndex: 3,
    applicationDate: '',
    nextFollowUp: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  
  const { getJobById, updateJob, deleteJob } = useJobs();
  const navigate = useNavigate();

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const result = await getJobById(id);
      if (result.success) {
        const jobData = result.job;
        setJob(jobData);
        setFormData({
          jobId: jobData.jobId || '',
          companyName: jobData.companyName || '',
          email: jobData.email || '',
          status: jobData.status || 'applied',
          roundNumber: jobData.roundNumber || 1,
          position: jobData.position || '',
          location: jobData.location || '',
          salary: jobData.salary || '',
          notes: jobData.notes || '',
          jobDescription: jobData.jobDescription || '',
          resume: jobData.resume || '',
          excitementIndex: jobData.excitementIndex || 3,
          applicationDate: jobData.applicationDate ? new Date(jobData.applicationDate).toISOString().split('T')[0] : '',
          nextFollowUp: jobData.nextFollowUp ? new Date(jobData.nextFollowUp).toISOString().split('T')[0] : ''
        });
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading job:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobId.trim()) {
      newErrors.jobId = 'Job ID is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.nextFollowUp && new Date(formData.nextFollowUp) < new Date()) {
      newErrors.nextFollowUp = 'Follow-up date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await updateJob(id, formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job application? This action cannot be undone.')) {
      const result = await deleteJob(id);
      if (result.success) {
        navigate('/dashboard');
      }
    }
  };

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'screening', label: 'Screening' },
    { value: 'phone-interview', label: 'Phone Interview' },
    { value: 'technical-interview', label: 'Technical Interview' },
    { value: 'onsite-interview', label: 'Onsite Interview' },
    { value: 'final-interview', label: 'Final Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Job not found</h2>
          <p className="mt-2 text-gray-600">The job application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <button
            onClick={handleDelete}
            className="btn-danger flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Job</span>
          </button>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Edit Job Application
        </h1>
        <p className="mt-2 text-gray-600">
          Update your job application details
        </p>
        
        {/* Current Status Display */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <StatusBadge status={job.status} />
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job ID */}
              <div>
                <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 mb-1">
                  Job ID *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="jobId"
                    name="jobId"
                    type="text"
                    required
                    value={formData.jobId}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.jobId ? 'border-red-500' : ''}`}
                    placeholder="e.g., JOB-2024-001"
                  />
                </div>
                {errors.jobId && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobId}</p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.companyName ? 'border-red-500' : ''}`}
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="hr@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>
          </div>

          {/* Status and Location */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Status & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Round Number */}
              <div>
                <label htmlFor="roundNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Round Number
                </label>
                <input
                  id="roundNumber"
                  name="roundNumber"
                  type="number"
                  min="1"
                  value={formData.roundNumber}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Additional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Salary */}
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    value={formData.salary}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="e.g., $80k - $120k"
                  />
                </div>
              </div>

              {/* Application Date */}
              <div>
                <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="applicationDate"
                    name="applicationDate"
                    type="date"
                    value={formData.applicationDate}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Next Follow-up */}
            <div className="mt-6">
              <label htmlFor="nextFollowUp" className="block text-sm font-medium text-gray-700 mb-1">
                Next Follow-up Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nextFollowUp"
                  name="nextFollowUp"
                  type="date"
                  value={formData.nextFollowUp}
                  onChange={handleChange}
                  className={`input-field pl-10 ${errors.nextFollowUp ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.nextFollowUp && (
                <p className="mt-1 text-sm text-red-600">{errors.nextFollowUp}</p>
              )}
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Add any additional notes about this application..."
              />
            </div>

            {/* Job Description */}
            <div className="mt-6">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                rows="4"
                value={formData.jobDescription}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Paste the job description or key details about the role..."
              />
            </div>

            {/* Resume and Excitement Index */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Resume */}
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                  Resume Used
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="resume"
                    name="resume"
                    type="text"
                    value={formData.resume}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="e.g., Software Engineer Resume v2"
                  />
                </div>
              </div>

              {/* Excitement Index */}
              <div>
                <label htmlFor="excitementIndex" className="block text-sm font-medium text-gray-700 mb-1">
                  Excitement Level
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    id="excitementIndex"
                    name="excitementIndex"
                    value={formData.excitementIndex}
                    onChange={handleChange}
                    className="input-field flex-1"
                  >
                    <option value="1">😞 Not excited (1)</option>
                    <option value="2">😐 Meh (2)</option>
                    <option value="3">🙂 Interested (3)</option>
                    <option value="4">😊 Very excited (4)</option>
                    <option value="5">🤩 Dream job! (5)</option>
                  </select>
                  <span className="text-2xl">
                    {(() => {
                      const emojis = ['😞', '😐', '🙂', '😊', '🤩'];
                      return emojis[formData.excitementIndex - 1] || '😐';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Update Job Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
