import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Mail, 
  Building, 
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  Star,
  Clock,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';

const Dashboard = () => {
  const { 
    jobs, 
    stats, 
    loading, 
    filters, 
    pagination, 
    setFilters, 
    setPagination, 
    deleteJob,
    refreshJobs 
  } = useJobs();
  const { user, logout } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  const handleStatusFilter = (status) => {
    setFilters({ status: filters.status === status ? '' : status });
  };

  const handlePageChange = (page) => {
    setPagination({ currentPage: page });
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      await deleteJob(jobId);
    }
  };

  // Excitement index emojis
  const getExcitementEmoji = (index) => {
    const emojis = ['😞', '😐', '🙂', '😊', '🤩'];
    return emojis[index - 1] || '😐';
  };

  // Get status color for cards
  const getStatusColor = (status) => {
    const colors = {
      'applied': 'bg-blue-50 border-blue-200',
      'screening': 'bg-yellow-50 border-yellow-200',
      'phone-interview': 'bg-orange-50 border-orange-200',
      'technical-interview': 'bg-purple-50 border-purple-200',
      'onsite-interview': 'bg-indigo-50 border-indigo-200',
      'final-interview': 'bg-pink-50 border-pink-200',
      'offer': 'bg-green-50 border-green-200',
      'accepted': 'bg-emerald-50 border-emerald-200',
      'rejected': 'bg-red-50 border-red-200',
      'withdrawn': 'bg-gray-50 border-gray-200'
    };
    return colors[status] || 'bg-gray-50 border-gray-200';
  };

  const statusOptions = [
    { value: 'applied', label: 'Applied', count: stats.applied },
    { value: 'screening', label: 'Screening', count: stats.inProgress },
    { value: 'phone-interview', label: 'Phone Interview', count: stats.inProgress },
    { value: 'technical-interview', label: 'Technical Interview', count: stats.inProgress },
    { value: 'onsite-interview', label: 'Onsite Interview', count: stats.inProgress },
    { value: 'final-interview', label: 'Final Interview', count: stats.inProgress },
    { value: 'offer', label: 'Offer', count: stats.offers },
    { value: 'accepted', label: 'Accepted', count: stats.accepted },
    { value: 'rejected', label: 'Rejected', count: stats.rejected },
    { value: 'withdrawn', label: 'Withdrawn', count: 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Track and manage your job applications with style
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              to="/analytics"
              className="btn-secondary flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <Link
              to="/add-job"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Job</span>
            </Link>
            <button
              onClick={logout}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Applied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-700">In Progress</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Offers</p>
              <p className="text-2xl font-bold text-green-900">{stats.offers}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <div className="flex items-center">
            <div className="p-2 bg-teal-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-teal-700">Accepted</p>
              <p className="text-2xl font-bold text-teal-900">{stats.accepted}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-500 rounded-lg">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-red-700">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company or job ID..."
                className="input-field pl-10"
              />
            </div>
          </form>

          {/* View Mode Toggle and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Table
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={refreshJobs}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status:</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusFilter(status.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.status === status.value
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label} ({status.count})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Jobs Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Job Applications ({pagination.totalJobs})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first job application'
              }
            </p>
            {!filters.search && !filters.status && (
              <div className="mt-6">
                <Link to="/add-job" className="btn-primary">
                  Add your first job
                </Link>
              </div>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <>
            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className={`card ${getStatusColor(job.status)} hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.companyName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">ID: {job.jobId}</p>
                      <div className="flex items-center space-x-2">
                        <StatusBadge status={job.status} />
                        <span className="text-xs text-gray-500">
                          Round {job.roundNumber}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl" title={`Excitement Level: ${job.excitementIndex}/5`}>
                        {getExcitementEmoji(job.excitementIndex)}
                      </span>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-4">
                    {job.position && (
                      <div className="flex items-center text-sm text-gray-700">
                        <Building className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">{job.position}</span>
                      </div>
                    )}
                    
                    {job.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {job.location}
                      </div>
                    )}

                    {job.salary && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        {job.salary}
                      </div>
                    )}

                    {job.resume && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="truncate">{job.resume}</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      Updated {format(new Date(job.lastUpdated), 'MMM dd, yyyy')}
                    </div>
                  </div>

                  {/* Job Description Preview */}
                  {job.jobDescription && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {job.jobDescription}
                      </p>
                    </div>
                  )}

                  {/* Notes Preview */}
                  {job.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        <strong>Notes:</strong> {job.notes}
                      </p>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/edit-job/${job._id}`}
                        className="btn-secondary btn-sm flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="btn-secondary btn-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{job.excitementIndex}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Excitement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {job.companyName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {job.jobId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {job.position || 'N/A'}
                        </div>
                        {job.location && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{getExcitementEmoji(job.excitementIndex)}</span>
                          <span className="text-sm text-gray-600">{job.excitementIndex}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(job.lastUpdated), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/edit-job/${job._id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
