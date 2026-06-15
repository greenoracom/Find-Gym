import React, { useState, useEffect } from 'react';
import { updateProfile, changePassword } from '../../../../services/cityAdminApi';

const Settings = () => {
  const [profile, setProfile] = useState({ fullName: '', phone: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    setProfile({
      fullName: admin.fullName || '',
      phone: admin.phone || '',
    });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await updateProfile(profile);
      if (res.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        localStorage.setItem('admin', JSON.stringify(res.data));
      } else {
        setProfileMsg({ type: 'error', text: res.message || 'Update failed' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Error updating profile' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      const res = await changePassword(passwords.oldPassword, passwords.newPassword);
      if (res.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Password update failed' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Error updating password' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-slate-500 text-sm">Update your profile details and secure your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {profileMsg.text && (
              <div
                className={`p-3 rounded text-sm ${
                  profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {profileMsg.text}
              </div>
            )}
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordMsg.text && (
              <div
                className={`p-3 rounded text-sm ${
                  passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Old Password</label>
              <input
                type="password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
