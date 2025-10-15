
import React, { useState } from 'react';
import { ChargingPoint, Booking } from '../types';
import ChargerCard from './ChargerCard';
import ChargerMap from './ChargerMap';
import { MapPinIcon } from './icons/MapPinIcon';
import { ListIcon } from './icons/ListIcon';

interface DriverViewProps {
  chargers: ChargingPoint[];
  bookings: Booking[];
}

const DriverView: React.FC<DriverViewProps> = ({ chargers, bookings }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCharger, setSelectedCharger] = useState<ChargingPoint | null>(chargers[0] || null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-dark">Encuentra tu Carga</h1>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-2 ${viewMode === 'map' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MapPinIcon className="h-5 w-5" />
            <span>Mapa</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-2 ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ListIcon className="h-5 w-5" />
            <span>Lista</span>
          </button>
        </div>
      </div>
      
      {viewMode === 'map' ? (
        <ChargerMap 
          chargers={chargers} 
          selectedCharger={selectedCharger} 
          onSelectCharger={setSelectedCharger}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chargers.map(charger => (
            <ChargerCard key={charger.id} charger={charger} />
          ))}
        </div>
      )}

      {/* Booking summary could go here */}
    </div>
  );
};

export default DriverView;
