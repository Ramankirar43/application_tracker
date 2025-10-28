import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Key, Mail, ArrowLeft, Sparkles, Shield, Clock } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  const { verifyOTP, resendOTP, loading } = useAuth();
  const navigate = useNavigate();

  const validateOTPForm = () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOTPForm()) {
      return;
    }

    // Check if email is available
    if (!email) {
      console.error('Email is missing!');
      alert('Email is missing. Please go back to signup.');
      return;
    }

    console.log('Submitting OTP verification...');
    console.log('Email:', email);
    console.log('OTP:', otp);
    
    try {
      const result = await verifyOTP(email, otp);
      console.log('OTP verification result:', result);
      
      if (result.success) {
        console.log('OTP verification successful, navigating to dashboard...');
        navigate('/dashboard');
      } else {
        console.log('OTP verification failed:', result.error);
        // Show more specific error message
        if (result.error === 'Validation failed') {
          alert('Please check your OTP code. It should be exactly 6 digits.');
        } else {
          alert(`Verification failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      alert('Email is missing. Please go back to signup.');
      return;
    }
    
    const result = await resendOTP(email);
    if (result.success) {
      setOtp('');
      setErrors({});
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    
    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: ''
      }));
    }
  };

  const handleBackToSignup = () => {
    navigate('/signup');
  };

  // If no email in URL, redirect to signup
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Email Not Found
            </h2>
            <p className="text-red-600 mb-6">
              No email address provided. Please complete the signup process first.
            </p>
            <button
              onClick={handleBackToSignup}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Go to Signup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Verify your email
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              We've sent a verification code to your email
            </p>
          </div>

          {/* Email Display */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-blue-900 font-medium">{email}</span>
            </div>
          </div>

          {/* OTP Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form className="space-y-6" onSubmit={handleOTPSubmit}>
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={handleOTPChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest font-mono ${
                      errors.otp 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="000000"
                    maxLength="6"
                    autoFocus
                  />
                </div>
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <LoadingSpinner size="sm" color="white" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Verify Email</span>
                      <Shield className="h-4 w-4" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            {/* Resend OTP */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                <Clock className="h-4 w-4" />
                <span>Resend Code</span>
              </button>
            </div>

            {/* Back to signup */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToSignup}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to signup</span>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Security Notice</span>
              </div>
              <p className="text-xs text-gray-500">
                This verification code will expire in 10 minutes for your security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-lg text-center px-8">
          <div className="relative">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            
            {/* Main content */}
            <div className="relative z-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-2xl mb-6 inline-block">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Secure Verification
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  We've sent a secure verification code to your email address. 
                  This helps us ensure your account is protected and verified.
                </p>
                
                {/* Security features */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">End-to-end encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">10-minute expiration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">One-time use only</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Instant delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
