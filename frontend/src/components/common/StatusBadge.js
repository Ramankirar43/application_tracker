import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    'applied': {
      label: 'Applied',
      className: 'status-applied'
    },
    'screening': {
      label: 'Screening',
      className: 'status-screening'
    },
    'phone-interview': {
      label: 'Phone Interview',
      className: 'status-phone-interview'
    },
    'technical-interview': {
      label: 'Technical Interview',
      className: 'status-technical-interview'
    },
    'onsite-interview': {
      label: 'Onsite Interview',
      className: 'status-onsite-interview'
    },
    'final-interview': {
      label: 'Final Interview',
      className: 'status-final-interview'
    },
    'offer': {
      label: 'Offer',
      className: 'status-offer'
    },
    'accepted': {
      label: 'Accepted',
      className: 'status-accepted'
    },
    'rejected': {
      label: 'Rejected',
      className: 'status-rejected'
    },
    'withdrawn': {
      label: 'Withdrawn',
      className: 'status-withdrawn'
    }
  };

  const config = statusConfig[status] || {
    label: status,
    className: 'status-applied'
  };

  return (
    <span className={`status-badge ${config.className} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
