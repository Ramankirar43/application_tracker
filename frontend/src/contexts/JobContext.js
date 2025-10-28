// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from './AuthContext';

// const JobContext = createContext();

// // Action types
// const JOB_ACTIONS = {
//   SET_LOADING: 'SET_LOADING',
//   SET_JOBS: 'SET_JOBS',
//   ADD_JOB: 'ADD_JOB',
//   UPDATE_JOB: 'UPDATE_JOB',
//   DELETE_JOB: 'DELETE_JOB',
//   SET_STATS: 'SET_STATS',
//   SET_ERROR: 'SET_ERROR',
//   CLEAR_ERROR: 'CLEAR_ERROR',
//   SET_FILTERS: 'SET_FILTERS',
//   SET_PAGINATION: 'SET_PAGINATION'
// };

// // Initial state
// const initialState = {
//   jobs: [],
//   stats: {
//     totalJobs: 0,
//     applied: 0,
//     inProgress: 0,
//     offers: 0,
//     accepted: 0,
//     rejected: 0
//   },
//   loading: false,
//   error: null,
//   filters: {
//     status: '',
//     search: ''
//   },
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalJobs: 0,
//     hasNext: false,
//     hasPrev: false
//   }
// };

// // Reducer
// const jobReducer = (state, action) => {
//   switch (action.type) {
//     case JOB_ACTIONS.SET_LOADING:
//       return { ...state, loading: action.payload };
//     case JOB_ACTIONS.SET_JOBS:
//       return { 
//         ...state, 
//         jobs: action.payload.jobs,
//         pagination: action.payload.pagination,
//         stats: action.payload.stats,
//         loading: false,
//         error: null
//       };
//     case JOB_ACTIONS.ADD_JOB:
//       return { 
//         ...state, 
//         jobs: [action.payload, ...state.jobs],
//         stats: { ...state.stats, totalJobs: state.stats.totalJobs + 1 }
//       };
//     case JOB_ACTIONS.UPDATE_JOB:
//       return {
//         ...state,
//         jobs: state.jobs.map(job => 
//           job._id === action.payload._id ? action.payload : job
//         )
//       };
//     case JOB_ACTIONS.DELETE_JOB:
//       return {
//         ...state,
//         jobs: state.jobs.filter(job => job._id !== action.payload),
//         stats: { ...state.stats, totalJobs: Math.max(0, state.stats.totalJobs - 1) }
//       };
//     case JOB_ACTIONS.SET_STATS:
//       return { ...state, stats: action.payload };
//     case JOB_ACTIONS.SET_ERROR:
//       return { ...state, error: action.payload, loading: false };
//     case JOB_ACTIONS.CLEAR_ERROR:
//       return { ...state, error: null };
//     case JOB_ACTIONS.SET_FILTERS:
//       return { ...state, filters: { ...state.filters, ...action.payload } };
//     case JOB_ACTIONS.SET_PAGINATION:
//       return { ...state, pagination: { ...state.pagination, ...action.payload } };
//     default:
//       return state;
//   }
// };

// // Job Provider Component
// export const JobProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(jobReducer, initialState);
//   const { user } = useAuth();

//   // Load jobs when user changes or filters change
//   useEffect(() => {
//     if (user) {
//       loadJobs();
//     }
//   }, [user, state.filters, state.pagination.currentPage]);

//   // Load jobs function
//   const loadJobs = async () => {
//     try {
//       dispatch({ type: JOB_ACTIONS.SET_LOADING, payload: true });
      
//       const params = new URLSearchParams({
//         page: state.pagination.currentPage,
//         limit: 10,
//         ...state.filters
//       });

//       const response = await axios.get(`/api/jobs?${params}`);
//       const { jobs, pagination, stats } = response.data;
      
//       dispatch({ 
//         type: JOB_ACTIONS.SET_JOBS, 
//         payload: { jobs, pagination, stats } 
//       });
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to load jobs';
//       dispatch({ type: JOB_ACTIONS.SET_ERROR, payload: message });
//       toast.error(message);
//     }
//   };

//   // Add job function
//   const addJob = async (jobData) => {
//     try {
//       dispatch({ type: JOB_ACTIONS.SET_LOADING, payload: true });
      
//       const response = await axios.post('/api/jobs', jobData);
//       const newJob = response.data.job;
      
//       dispatch({ type: JOB_ACTIONS.ADD_JOB, payload: newJob });
//       toast.success('Job application added successfully!');
      
//       return { success: true, job: newJob };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to add job';
//       dispatch({ type: JOB_ACTIONS.SET_ERROR, payload: message });
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Update job function
//   const updateJob = async (jobId, jobData) => {
//     try {
//       dispatch({ type: JOB_ACTIONS.SET_LOADING, payload: true });
      
//       const response = await axios.put(`/api/jobs/${jobId}`, jobData);
//       const updatedJob = response.data.job;
      
//       dispatch({ type: JOB_ACTIONS.UPDATE_JOB, payload: updatedJob });
//       toast.success('Job application updated successfully!');
      
//       return { success: true, job: updatedJob };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to update job';
//       dispatch({ type: JOB_ACTIONS.SET_ERROR, payload: message });
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Delete job function
//   const deleteJob = async (jobId) => {
//     try {
//       await axios.delete(`/api/jobs/${jobId}`);
      
//       dispatch({ type: JOB_ACTIONS.DELETE_JOB, payload: jobId });
//       toast.success('Job application deleted successfully!');
      
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to delete job';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Update job status function
//   const updateJobStatus = async (jobId, status, roundNumber) => {
//     try {
//       const response = await axios.patch(`/api/jobs/${jobId}/status`, {
//         status,
//         roundNumber
//       });
      
//       const updatedJob = response.data.job;
//       dispatch({ type: JOB_ACTIONS.UPDATE_JOB, payload: updatedJob });
//       toast.success('Job status updated successfully!');
      
//       return { success: true, job: updatedJob };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to update job status';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Get job by ID function
//   const getJobById = async (jobId) => {
//     try {
//       const response = await axios.get(`/api/jobs/${jobId}`);
//       return { success: true, job: response.data.job };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Failed to get job';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   // Set filters function
//   const setFilters = (filters) => {
//     dispatch({ type: JOB_ACTIONS.SET_FILTERS, payload: filters });
//     dispatch({ type: JOB_ACTIONS.SET_PAGINATION, payload: { currentPage: 1 } });
//   };

//   // Set pagination function
//   const setPagination = (pagination) => {
//     dispatch({ type: JOB_ACTIONS.SET_PAGINATION, payload: pagination });
//   };

//   // Clear error function
//   const clearError = () => {
//     dispatch({ type: JOB_ACTIONS.CLEAR_ERROR });
//   };

//   // Refresh jobs function
//   const refreshJobs = () => {
//     loadJobs();
//   };

//   const value = {
//     jobs: state.jobs,
//     stats: state.stats,
//     loading: state.loading,
//     error: state.error,
//     filters: state.filters,
//     pagination: state.pagination,
//     addJob,
//     updateJob,
//     deleteJob,
//     updateJobStatus,
//     getJobById,
//     setFilters,
//     setPagination,
//     clearError,
//     refreshJobs
//   };

//   return (
//     <JobContext.Provider value={value}>
//       {children}
//     </JobContext.Provider>
//   );
// };

// // Custom hook to use job context
// export const useJobs = () => {
//   const context = useContext(JobContext);
//   if (!context) {
//     throw new Error('useJobs must be used within a JobProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const JobContext = createContext();

// Action types
const JOB_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_JOBS: 'SET_JOBS',
  ADD_JOB: 'ADD_JOB',
  UPDATE_JOB: 'UPDATE_JOB',
  DELETE_JOB: 'DELETE_JOB',
  SET_STATS: 'SET_STATS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION'
};

// Initial state
const initialState = {
  jobs: [],
  stats: {
    totalJobs: 0,
    applied: 0,
    inProgress: 0,
    offers: 0,
    accepted: 0,
    rejected: 0
  },
  loading: false,
  error: null,
  filters: {
    status: '',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false
  }
};

// ✅ Use backend base URL from environment variable
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Reducer
const jobReducer = (state, action) => {
  switch (action.type) {
    case JOB_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case JOB_ACTIONS.SET_JOBS:
      return {
        ...state,
        jobs: action.payload.jobs,
        pagination: action.payload.pagination,
        stats: action.payload.stats,
        loading: false,
        error: null
      };
    case JOB_ACTIONS.ADD_JOB:
      return {
        ...state,
        jobs: [action.payload, ...state.jobs],
        stats: { ...state.stats, totalJobs: state.stats.totalJobs + 1 }
      };
    case JOB_ACTIONS.UPDATE_JOB:
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job._id === action.payload._id ? action.payload : job
        )
      };
    case JOB_ACTIONS.DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter(job => job._id !== action.payload),
        stats: { ...state.stats, totalJobs: Math.max(0, state.stats.totalJobs - 1) }
      };
    case JOB_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    case JOB_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case JOB_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case JOB_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case JOB_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    default:
      return state;
  }
};

// Job Provider Component
export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);
  const { user } = useAuth();

  // Load jobs when user changes or filters change
  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user, state.filters, state.pagination.currentPage]);

  // Load jobs function
  const loadJobs = async () => {
    try {
      dispatch({ type: JOB_ACTIONS.SET_LOADING, payload: true });

      const params = new URLSearchParams({
        page: state.pagination.currentPage,
        limit: 10,
        ...state.filters
      });

      const response = await axios.get(`${API}/api/jobs?${params}`);
      const { jobs, pagination, stats } = response.data;

      dispatch({
        type: JOB_ACTIONS.SET_JOBS,
        payload: { jobs, pagination, stats }
      });
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to load jobs';
      dispatch({ type: JOB_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
    }
  };

  // Add job function
  const addJob = async (jobData) => {
    try {
      dispatch({ type: JOB_ACTIONS.SET_LOADING, payload: true });

      const response = await axios.post(`${API}/api/jobs`, jobData);
      const newJob = response.data.job;

      dispatch({ type: JOB_ACTIONS.ADD_JOB, payload: newJob });
      toast.success('Job application added successfully!');

      return { success: true, job: newJob };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add job';
      dispatch({ type: JOB_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update job function
  const updateJob = async (jobId, jobData) => {
    try {
      dispatch({ type: JOB_ACTIONS.SET_LOADING, payload: true });

      const response = await axios.put(`${API}/api/jobs/${jobId}`, jobData);
      const updatedJob = response.data.job;

      dispatch({ type: JOB_ACTIONS.UPDATE_JOB, payload: updatedJob });
      toast.success('Job application updated successfully!');

      return { success: true, job: updatedJob };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update job';
      dispatch({ type: JOB_ACTIONS.SET_ERROR, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete job function
  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`${API}/api/jobs/${jobId}`);

      dispatch({ type: JOB_ACTIONS.DELETE_JOB, payload: jobId });
      toast.success('Job application deleted successfully!');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete job';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update job status function
  const updateJobStatus = async (jobId, status, roundNumber) => {
    try {
      const response = await axios.patch(`${API}/api/jobs/${jobId}/status`, {
        status,
        roundNumber
      });

      const updatedJob = response.data.job;
      dispatch({ type: JOB_ACTIONS.UPDATE_JOB, payload: updatedJob });
      toast.success('Job status updated successfully!');

      return { success: true, job: updatedJob };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update job status';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get job by ID function
  const getJobById = async (jobId) => {
    try {
      const response = await axios.get(`${API}/api/jobs/${jobId}`);
      return { success: true, job: response.data.job };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get job';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Set filters function
  const setFilters = (filters) => {
    dispatch({ type: JOB_ACTIONS.SET_FILTERS, payload: filters });
    dispatch({ type: JOB_ACTIONS.SET_PAGINATION, payload: { currentPage: 1 } });
  };

  // Set pagination function
  const setPagination = (pagination) => {
    dispatch({ type: JOB_ACTIONS.SET_PAGINATION, payload: pagination });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: JOB_ACTIONS.CLEAR_ERROR });
  };

  // Refresh jobs function
  const refreshJobs = () => {
    loadJobs();
  };

  const value = {
    jobs: state.jobs,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    addJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    getJobById,
    setFilters,
    setPagination,
    clearError,
    refreshJobs
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook to use job context
export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
