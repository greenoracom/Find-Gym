import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserRegister = () => {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    phoneCode: '+91',
    phone: '',
    otp: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    profilePhoto: null,
    fitnessGoal: '',
    location: '',
    city: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, profilePhoto: null });
    setPhotoPreview(null);
  };

  const handleSendOTP = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required to send OTP';
    }
    if (!formData.phone || formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setOtpSent(true);
    setErrors({});
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
      if (!formData.phone || formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be exactly 10 digits';
      if (otpSent) {
        if (!formData.otp || formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) newErrors.otp = 'OTP must be exactly 6 digits';
      } else {
        newErrors.otp = 'Please send and enter OTP first';
      }
    } else if (step === 2) {
      const hasLetters = /[a-zA-Z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      if (!formData.password || formData.password.length < 8 || !hasLetters || !hasNumbers) {
        newErrors.password = 'Password must meet all requirements';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 3) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.age || formData.age < 16 || formData.age > 100) newErrors.age = 'Age must be between 16 and 100';
      if (!formData.gender) newErrors.gender = 'Please select a gender';
      if (!formData.height || formData.height < 100 || formData.height > 250) newErrors.height = 'Height must be between 100 and 250 cm';
      if (!formData.weight || formData.weight < 30 || formData.weight > 300) newErrors.weight = 'Weight must be between 30 and 300 kg';
    } else if (step === 4) {
      if (!formData.fitnessGoal) newErrors.fitnessGoal = 'Please select a fitness goal';
    } else if (step === 5) {
      if (!formData.location) newErrors.location = 'Please select a region';
      if (!formData.city) newErrors.city = 'Please select a city';
    } else if (step === 6) {
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form Data Submitted:', formData);
      setSuccessMsg('Account created successfully! Check console for details.');
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Step {step} of 6</span>
        </div>
        <div className="flex gap-1 h-2">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className={`flex-1 rounded-full transition-colors duration-300 ${
                idx <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Helper for input classes
  const getInputClasses = (fieldName) => `
    w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all
    bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white
    ${errors[fieldName] ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-[420px]">
        {successMsg && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl shadow-sm text-center font-medium animate-fade-in">
            {successMsg}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 animate-fade-in transition-all duration-300">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h2>
          
          {renderProgressBar()}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Email & Phone */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={getInputClasses('email')}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleChange}
                      className="w-1/3 px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={getInputClasses('phone')}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="w-full py-3 px-4 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Send OTP
                  </button>
                ) : (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                    <div className="flex gap-2">
                      <input
                        name="otp"
                        type="text"
                        maxLength="6"
                        value={formData.otp}
                        onChange={handleChange}
                        className={getInputClasses('otp')}
                        placeholder="123456"
                      />
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="px-4 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors whitespace-nowrap"
                      >
                        Resend
                      </button>
                    </div>
                    {errors.otp && <p className="mt-1 text-sm text-red-500">{errors.otp}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={getInputClasses('password')}
                    placeholder="••••••••"
                  />
                  
                  {/* Password requirements */}
                  <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className={formData.password.length >= 8 ? 'text-green-500' : ''}>
                        {formData.password.length >= 8 ? '✓' : '○'} Min 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={/[a-zA-Z]/.test(formData.password) ? 'text-green-500' : ''}>
                        {/[a-zA-Z]/.test(formData.password) ? '✓' : '○'} Contains letters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={/\d/.test(formData.password) ? 'text-green-500' : ''}>
                        {/\d/.test(formData.password) ? '✓' : '○'} Contains numbers
                      </span>
                    </div>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={getInputClasses('confirmPassword')}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Profile */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <div className="relative">
                        <img src={photoPreview} alt="Preview" className="h-16 w-16 object-cover rounded-full border-2 border-blue-500" />
                        <button 
                          type="button" 
                          onClick={removePhoto}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={getInputClasses('fullName')}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                    <input
                      name="age"
                      type="number"
                      min="16"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      className={getInputClasses('age')}
                      placeholder="e.g. 25"
                    />
                    {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={getInputClasses('gender')}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                    <input
                      name="height"
                      type="number"
                      min="100"
                      max="250"
                      value={formData.height}
                      onChange={handleChange}
                      className={getInputClasses('height')}
                      placeholder="e.g. 175"
                    />
                    {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                    <input
                      name="weight"
                      type="number"
                      min="30"
                      max="300"
                      value={formData.weight}
                      onChange={handleChange}
                      className={getInputClasses('weight')}
                      placeholder="e.g. 70"
                    />
                    {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Goal */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <label className="block text-base font-medium text-gray-900 dark:text-white mb-2">What is your primary fitness goal?</label>
                
                {[
                  { id: 'weightLoss', title: 'Weight Loss', desc: 'Burn fat & lose weight' },
                  { id: 'muscle', title: 'Build Muscle', desc: 'Gain strength & muscle' },
                  { id: 'general', title: 'General Fitness', desc: 'Stay healthy & active' },
                  { id: 'flexibility', title: 'Flexibility & Wellness', desc: 'Yoga, stretching & calm' }
                ].map((goal) => (
                  <label 
                    key={goal.id}
                    className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                      formData.fitnessGoal === goal.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="fitnessGoal"
                        value={goal.id}
                        checked={formData.fitnessGoal === goal.id}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">{goal.title}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{goal.desc}</span>
                      </div>
                    </div>
                  </label>
                ))}
                {errors.fitnessGoal && <p className="mt-2 text-sm text-red-500">{errors.fitnessGoal}</p>}
              </div>
            )}

            {/* Step 5: Location */}
            {step === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Region</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={getInputClasses('location')}
                  >
                    <option value="">Select region</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={getInputClasses('city')}
                  >
                    <option value="">Select city</option>
                    {['Pimpri', 'Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh'].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
              </div>
            )}

            {/* Step 6: Terms */}
            {step === 6 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="font-medium text-gray-700 dark:text-gray-300">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </label>
                    {errors.agreeTerms && <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-1/3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back
                </button>
              )}
              
              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`${step > 1 ? 'w-2/3' : 'w-full'} flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 duration-300`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${step > 1 ? 'w-2/3' : 'w-full'} flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 duration-300`}
                >
                  Create Account
                </button>
              )}
            </div>
            
            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Already have an account? Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
