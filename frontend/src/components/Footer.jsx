import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Gym
            </h1>
            <p className="text-gray-500 text-base">
              Making fitness accessible by connecting you with the perfect gym and trainers in your area.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Home</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">About Us</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Gyms</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact Information</h3>
                <ul className="mt-4 space-y-4">
                  <li className="text-base text-gray-500">contact@findgym.com</li>
                  <li className="text-base text-gray-500">+1 (555) 123-4567</li>
                  <li className="text-base text-gray-500">123 Fitness Ave, Health City, CA 90210</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} Find Gym. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
