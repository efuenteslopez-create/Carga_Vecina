
import React, { useState, useMemo } from 'react';
import { UserRole, View } from './types';
import { mockUser, mockChargers, mockBookings } from './constants';
import Header from './components/Header';
import DriverView from './components/DriverView';
import HostView from './components/HostView';
import AssistantModal from './components/AssistantModal';
import { BotIcon } from './components/icons/BotIcon';

const App: React.FC = () => {
  const [currentUser] = useState(mockUser);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.Driver);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const driverBookings = useMemo(() => mockBookings.filter(b => b.userId === currentUser.id), [currentUser.id]);
  const hostChargers = useMemo(() => mockChargers.filter(c => c.hostId === currentUser.id), [currentUser.id]);
  const hostBookings = useMemo(() => {
    const hostChargerIds = hostChargers.map(c => c.id);
    return mockBookings.filter(b => hostChargerIds.includes(b.chargerId));
  }, [hostChargers]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header
        user={currentUser}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {activeRole === UserRole.Driver ? (
          <DriverView chargers={mockChargers} bookings={driverBookings} />
        ) : (
          <HostView chargers={hostChargers} bookings={hostBookings} />
        )}
      </main>
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        aria-label="Open AI Assistant"
      >
        <BotIcon className="h-8 w-8" />
      </button>
      <AssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        context={{
          role: activeRole,
          chargers: activeRole === UserRole.Host ? hostChargers : mockChargers,
          bookings: activeRole === UserRole.Host ? hostBookings : driverBookings,
        }}
      />
    </div>
  );
};

export default App;
