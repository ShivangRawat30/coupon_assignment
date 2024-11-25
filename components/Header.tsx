import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-4 py-3 shadow-md bg-white dark:bg-gray-900">
      {/* Logo or Brand */}
      <div className="text-lg font-bold text-gray-900 dark:text-white">
        MyApp
      </div>

      {/* Navigation Links (Optional) */}
      <nav className="hidden md:flex space-x-6">
        <a
          href="#"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Home
        </a>
        <a
          href="#"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          About
        </a>
        <a
          href="#"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Contact
        </a>
      </nav>

      {/* Connect Button */}
      <div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
