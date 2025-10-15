
import React from 'react';
import { User, UserRole } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { DriverIcon } from './icons/DriverIcon';
import { HostIcon } from './icons/HostIcon';

interface HeaderProps {
  user: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ user, activeRole, onRoleChange }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-10 w-10 text-brand-primary" />
            <span className="text-2xl font-bold text-brand-dark tracking-tight">
              CargaVecina
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              {user.roles.includes(UserRole.Driver) && (
                <button
                  onClick={() => onRoleChange(UserRole.Driver)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeRole === UserRole.Driver
                      ? 'bg-brand-primary text-white shadow'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <DriverIcon className="h-5 w-5" />
                  <span>Conductor</span>
                </button>
              )}
              {user.roles.includes(UserRole.Host) && (
                <button
                  onClick={() => onRoleChange(UserRole.Host)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeRole === UserRole.Host
                      ? 'bg-brand-secondary text-white shadow'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <HostIcon className="h-5 w-5" />
                  <span>Anfitrión</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <img
                className="h-12 w-12 rounded-full object-cover border-2 border-brand-primary"
                src={user.avatarUrl}
                alt={user.name}
              />
              <div>
                <p className="font-semibold text-brand-dark">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
