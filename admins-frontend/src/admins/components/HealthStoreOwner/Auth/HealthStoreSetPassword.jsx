import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { validateSetPasswordToken, setPassword } from '../../../../services/healthStoreOwnerApi';

const HealthStoreSetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [storeInfo, setStoreInfo] = useState(null);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await validateSetPasswordToken(token);
        setStoreInfo(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid or expired setup token');
        navigate('/health-store-owner/login');
      } finally {
        setChecking(false);
      }
    };
    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await setPassword(token, form);
      toast.success('Password set successfully! Please login.');
      navigate('/health-store-owner/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set password');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col justify-center items-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-3" />
        <p className="text-gray-400">Verifying link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 shadow-inner mb-4">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Set Your <span className="text-red-500">Password</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            For store: <span className="text-white font-semibold">{storeInfo?.storeName}</span>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_4px_15px_rgba(239,68,68,0.3)] text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all transform active:scale-95"
                >
                  {submitting ? 'Setting Password...' : 'Save & Activate Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthStoreSetPassword;
