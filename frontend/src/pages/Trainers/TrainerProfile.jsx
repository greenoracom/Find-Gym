import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicTrainerById } from '../../userServices/trainerApi';
import toast from 'react-hot-toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Stars({ count = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i < Math.round(count) ? '#fbbf24' : 'rgba(251,191,36,0.18)'}
            stroke={i < Math.round(count) ? '#fbbf24' : 'rgba(251,191,36,0.2)'}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 text-[0.78rem] font-bold text-white uppercase tracking-widest mb-3">
      <span
        className="inline-block w-[3px] h-[14px] rounded-sm shrink-0"
        style={{ background: '#FF7A00', boxShadow: '0 0 6px rgba(255,122,0,0.5)' }}
      />
      {children}
    </div>
  );
}

function SkeletonPulse() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF7A00]/30 border-t-[#FF7A00] rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading trainer profile...</p>
      </div>
    </div>
  );
}

// Dynamic script loader for Razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Session'); // 'Session' or 'Monthly'
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (trainer) {
      if (trainer.trainingTypes?.length > 0) {
        setSelectedType(trainer.trainingTypes[0]);
      }
      const days = Array.isArray(trainer.availability)
        ? trainer.availability
        : trainer.availability?.days || [];
      if (days.length > 0) {
        setSelectedDay(days[0]);
      }
      const slots = trainer.availability?.timeSlots || [];
      if (slots.length > 0) {
        setSelectedTimeSlot(slots[0]);
      }
    }
  }, [trainer]);

  const handleOpenBookingModal = () => {
    const userToken = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (!userToken) {
      toast.error('Please login first to book a session.');
      navigate('/login');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setBookingLoading(false);
        return;
      }

      const amount = selectedPlan === 'Session' ? priceVal : (priceMonth || 0);

      const options = {
        key: 'rzp_test_SNw35MkokY8h1y',
        amount: Math.round(amount * 100), // in paise
        currency: 'INR',
        name: 'Find Gym Trainer Booking',
        description: `Session Booking (${selectedType}) with ${trainer.name}`,
        handler: async (response) => {
          toast.success(`Payment Successful! Booking request sent to ${trainer.name}.`, {
            duration: 5000,
            icon: '🎉',
            style: {
              background: '#1c1c1e',
              color: '#fff',
              border: '1px solid rgba(255, 122, 0, 0.2)',
            }
          });
          setIsBookingModalOpen(false);
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#FF7A00'
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      toast.error('Failed to initiate payment.');
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        const res = await getPublicTrainerById(trainerId);
        if (res.success && res.trainer) {
          setTrainer(res.trainer);
        } else {
          setError('Trainer not found.');
        }
      } catch (err) {
        setError('Could not load trainer profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [trainerId]);

  if (loading) return <SkeletonPulse />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center gap-4 text-white">
        <div className="text-5xl">⚠️</div>
        <p className="text-white/60">{error}</p>
        <button
          onClick={() => navigate('/trainers')}
          className="px-6 py-2.5 bg-[#FF7A00] text-white rounded-xl font-bold text-sm hover:bg-[#E66E00] transition-all"
        >
          Back to Trainers
        </button>
      </div>
    );
  }

  // Derived values
  const imageSrc =
    trainer.profilePhoto ||
    trainer.photo ||
    trainer.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.name)}&background=FF7A00&color=fff&size=400`;

  const ratingValue = typeof trainer.rating === 'object'
    ? (trainer.rating?.average || 0)
    : (trainer.rating || 0);
  const reviewsCount = typeof trainer.rating === 'object'
    ? (trainer.rating?.count || 0)
    : (trainer.reviews || 0);

  const expText =
    typeof trainer.experience === 'number'
      ? `${trainer.experience} Year${trainer.experience !== 1 ? 's' : ''}`
      : trainer.experience || 'Not specified';
  const locationText = trainer.city || trainer.location || 'India';
  const priceVal = trainer.pricePerSession || trainer.price || 0;
  const priceMonth = trainer.pricePerMonth;
  const languagesText = Array.isArray(trainer.languages)
    ? trainer.languages.join(', ')
    : trainer.languages || 'Not specified';
  const bioText =
    trainer.bio ||
    trainer.about ||
    'Certified professional trainer helping clients reach their fitness goals.';
  const specLabel =
    trainer.speciality ||
    (trainer.specializations?.length > 0
      ? trainer.specializations.join(', ')
      : 'Fitness Coach');

  const availabilityDays = Array.isArray(trainer.availability)
    ? trainer.availability
    : trainer.availability?.days || [];
  const timeSlots = trainer.availability?.timeSlots || [];
  const timeSlotsText =
    trainer.timeSlot ||
    (timeSlots.length > 0 ? timeSlots.join(', ') : 'Not specified');

  const ratingBreakdown = trainer.ratingBreakdown || [
    { stars: 5, pct: ratingValue >= 4.5 ? 75 : 20 },
    { stars: 4, pct: ratingValue >= 3.5 && ratingValue < 4.5 ? 70 : 10 },
    { stars: 3, pct: ratingValue >= 2.5 && ratingValue < 3.5 ? 60 : 5 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  const trainingTypeBadges = trainer.trainingTypes || [];
  const certifications = trainer.certifications || [];

  return (
    <div
      className="min-h-screen bg-[#0d0d0d] text-white font-['Inter',sans-serif]"
      style={{ paddingTop: '68px' }}
    >
      {/* Background gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,122,0,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 py-8 max-md:px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/trainers')}
          className="flex items-center gap-1.5 text-[0.8rem] font-medium text-white/40 hover:text-[#FF7A00] transition-colors mb-6 bg-transparent border-0 p-0 cursor-pointer"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Trainers
        </button>

        <div className="grid grid-cols-[320px_1fr] gap-8 items-start max-lg:grid-cols-1">
          {/* ═══════════════════════════════════
               LEFT PANEL
          ═══════════════════════════════════ */}
          <div className="flex flex-col gap-4 sticky top-[88px] max-lg:static">
            {/* Profile Photo */}
            <div
              className="relative rounded-[22px] overflow-hidden border border-[#FF7A00]/20 shadow-[0_0_40px_rgba(255,122,0,0.08)]"
              style={{ height: 340 }}
            >
              <img
                src={imageSrc}
                alt={trainer.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-transparent to-transparent" />

              {/* Rating pill */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/85 border border-yellow-400/30 rounded-full backdrop-blur-md">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-yellow-400 text-[0.8rem] font-bold">{ratingValue}</span>
              </div>

              {/* Status badge */}
              {(trainer.status === 'active' || trainer.status === 'approved') && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-green-500/15 border border-green-500/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                  <span className="text-green-400 text-[0.65rem] font-bold">Active</span>
                </div>
              )}
            </div>

            {/* Book a Session Card */}
            <div className="bg-[rgba(20,20,20,0.92)] border border-[#FF7A00]/22 rounded-2xl p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="text-[0.85rem] font-bold text-white/70 mb-1">Book a Session</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="text-[2.2rem] font-black"
                  style={{ color: '#FF7A00', textShadow: '0 0 20px rgba(255,122,0,0.4)' }}
                >
                  ₹{priceVal}
                </span>
                <span className="text-[0.78rem] text-white/35">/session</span>
              </div>
              {priceMonth && (
                <div className="text-[0.75rem] text-white/40 mb-3">
                  ₹{priceMonth}/month plan available
                </div>
              )}
              {trainer.trialSession && (
                <div className="flex items-center gap-1.5 mb-3 text-[0.72rem] text-green-400 bg-green-500/08 border border-green-500/20 rounded-lg px-3 py-1.5">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Trial available · ₹{trainer.trialPrice || 0}
                </div>
              )}
              <button
                onClick={handleOpenBookingModal}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FF7A00] to-[#E66E00] hover:to-[#FF9500] text-white font-extrabold text-[0.88rem] rounded-xl cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,122,0,0.4)] transition-all duration-200 shadow-[0_0_20px_rgba(255,122,0,0.25)]"
              >
                Book Now
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Training Types */}
            {trainingTypeBadges.length > 0 && (
              <div className="bg-[rgba(18,18,18,0.92)] border border-white/[0.07] rounded-2xl p-4">
                <SectionLabel>Training Formats</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {trainingTypeBadges.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-full text-[0.7rem] font-semibold text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Personal Details */}
            {(trainer.email || trainer.phone || trainer.gender) && (
              <div className="bg-[rgba(18,18,18,0.92)] border border-white/[0.07] rounded-2xl p-4">
                <SectionLabel>Contact & Details</SectionLabel>
                <div className="flex flex-col gap-3 pt-1">
                  {trainer.email && (
                    <div className="flex items-center gap-2.5 text-[0.8rem] text-white/70">
                      <svg className="w-4 h-4 text-[#FF7A00] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${trainer.email}`} className="hover:text-[#FF7A00] transition-colors truncate">{trainer.email}</a>
                    </div>
                  )}
                  {trainer.phone && (
                    <div className="flex items-center gap-2.5 text-[0.8rem] text-white/70">
                      <svg className="w-4 h-4 text-[#FF7A00] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${trainer.phone}`} className="hover:text-[#FF7A00] transition-colors">{trainer.phone}</a>
                    </div>
                  )}
                  {trainer.gender && (
                    <div className="flex items-center gap-2.5 text-[0.8rem] text-white/70 border-t border-white/5 pt-2.5 mt-1">
                      <span className="text-white/40">Gender:</span>
                      <span className="font-semibold text-white/80">{trainer.gender}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════
               RIGHT PANEL
          ═══════════════════════════════════ */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-[2.2rem] font-black text-white leading-tight mb-2 max-md:text-[1.7rem]">
                  {trainer.name}
                </h1>
                {/* Verified badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/28 rounded-full text-green-400 text-[0.7rem] font-semibold mb-2">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                  </svg>
                  Verified Trainer
                </span>
                <div className="text-[0.92rem] font-semibold text-[#FF7A00]">{specLabel}</div>
              </div>
              <div className="text-right shrink-0">
                <Stars count={ratingValue} size={15} />
                <div className="text-[0.78rem] font-bold text-yellow-400 mt-1">
                  {ratingValue} · {reviewsCount} Reviews
                </div>
              </div>
            </div>

            {/* Stats Pills */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  val: expText,
                  label: 'Experience',
                },
                {
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  val: `${trainer.totalBookings || 0}+`,
                  label: 'Trained',
                },
                {
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  val: locationText,
                  label: 'Location',
                },
                {
                  icon: (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  ),
                  val: languagesText,
                  label: 'Languages',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3.5 py-3 hover:border-[#FF7A00]/25 transition-colors"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <span className="block text-[0.82rem] font-bold text-white leading-snug">{s.val}</span>
                    <span className="block text-[0.62rem] text-white/35">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* About Me */}
            <div className="bg-[rgba(18,18,18,0.92)] border border-white/[0.07] rounded-2xl p-5">
              <SectionLabel>About Me</SectionLabel>
              <p className="text-[0.87rem] text-white/60 leading-[1.8]">{bioText}</p>
            </div>

            {/* Specializations */}
            <div className="bg-[rgba(18,18,18,0.92)] border border-white/[0.07] rounded-2xl p-5">
              <SectionLabel>Specializations</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {trainer.specializations && trainer.specializations.length > 0 ? (
                  trainer.specializations.map((s) => (
                    <span
                      key={s}
                      className="px-3.5 py-1.5 bg-[#FF7A00]/08 border border-[#FF7A00]/22 rounded-full text-[0.72rem] font-semibold text-[#FF7A00]"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-white/40 text-sm">None listed</span>
                )}
              </div>
            </div>

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="bg-[rgba(18,18,18,0.92)] border border-white/[0.07] rounded-2xl p-5">
                <SectionLabel>Certifications</SectionLabel>
                <div className="flex flex-col gap-2">
                  {certifications.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[0.82rem] text-white/65">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="bg-[rgba(18,18,18,0.92)] border border-white/[0.07] rounded-2xl p-5">
              <SectionLabel>Availability</SectionLabel>
              <div className="flex gap-2 flex-wrap mb-3">
                {DAYS.map((day) => {
                  const on = availabilityDays.some(d => d.toLowerCase().startsWith(day.toLowerCase()));
                  return (
                    <div
                      key={day}
                      className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border min-w-[48px] transition-colors ${
                        on
                          ? 'border-[#FF7A00]/30 bg-[#FF7A00]/10'
                          : 'border-white/[0.07] bg-white/[0.03]'
                      }`}
                    >
                      <span
                        className={`text-[0.6rem] font-bold uppercase tracking-wide ${
                          on ? 'text-[#FF7A00]' : 'text-white/25'
                        }`}
                      >
                        {day}
                      </span>
                      {on ? (
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#FF7A00">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-[9px] text-white/20">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-[0.8rem] text-white/50">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#FF7A00">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeSlotsText}
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div className="bg-[rgba(18,18,18,0.92)] border border-white/[0.07] rounded-2xl p-5">
              <SectionLabel>Ratings &amp; Reviews</SectionLabel>
              <div className="flex items-center gap-6 mb-5">
                <div className="text-center">
                  <div
                    className="text-[3.5rem] font-black leading-none"
                    style={{ color: ratingValue > 0 ? '#FF7A00' : '#ffffff' }}
                  >
                    {ratingValue}
                  </div>
                  <Stars count={ratingValue} size={13} />
                  <div className="text-[0.68rem] text-white/35 mt-1">{reviewsCount} Reviews</div>
                </div>
                <div className="flex-1">
                  {ratingBreakdown.map((r) => (
                    <div key={r.stars} className="flex items-center gap-2 mb-1.5">
                      <span className="text-[0.65rem] text-white/35 w-3 text-right shrink-0">{r.stars}</span>
                      <div className="flex-1 h-[5px] bg-white/[0.07] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${r.pct}%`,
                            background: 'linear-gradient(90deg, #E66E00, #FF7A00)',
                            boxShadow: '0 0 5px rgba(255,122,0,0.3)',
                          }}
                        />
                      </div>
                      <span className="text-[0.62rem] text-white/30 w-7 text-right shrink-0">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {reviewsCount === 0 && (
                <div className="text-center py-6 text-white/25 text-sm">
                  No reviews yet. Be the first to book a session!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1013] border border-zinc-800/80 rounded-[2rem] max-w-lg w-full p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all cursor-pointer z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative z-10 text-left">
              <h3 className="text-xl font-bold text-white mb-2">Book a Session</h3>
              <p className="text-zinc-400 text-xs mb-6">Select your package and training preferences to book {trainer.name}.</p>

              <div className="space-y-4">
                {/* Format selection */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Training Format</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                  >
                    {trainingTypeBadges.length > 0 ? (
                      trainingTypeBadges.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))
                    ) : (
                      <option value="Personal Training">Personal Training</option>
                    )}
                  </select>
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Select Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedPlan('Session')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPlan === 'Session'
                          ? 'border-[#FF7A00]/50 bg-[#FF7A00]/10 text-white'
                          : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold">Per Session</span>
                      <span className="text-sm font-black text-[#FF7A00] mt-1">₹{priceVal}</span>
                    </button>

                    {priceMonth && (
                      <button
                        onClick={() => setSelectedPlan('Monthly')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedPlan === 'Monthly'
                            ? 'border-[#FF7A00]/50 bg-[#FF7A00]/10 text-white'
                            : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold">Monthly Plan</span>
                        <span className="text-sm font-black text-[#FF7A00] mt-1">₹{priceMonth}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Day Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Preferred Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                  >
                    {availabilityDays.length > 0 ? (
                      availabilityDays.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))
                    ) : (
                      <option value="Monday">Monday</option>
                    )}
                  </select>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Preferred Time Slot</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                  >
                    {timeSlots.length > 0 ? (
                      timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))
                    ) : (
                      <option value="6:00 AM">6:00 AM</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#FF7A00] to-[#E66E00] hover:to-[#FF9500] text-white font-extrabold text-xs rounded-xl cursor-pointer hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                {bookingLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;
