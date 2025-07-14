import React from 'react';
import { ChefHat } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">SmartChef</span>
          </div>
          <p className="text-gray-400 text-center md:text-left">
            © 2024 SmartChef. Tous droits réservés. Cuisinez avec passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;