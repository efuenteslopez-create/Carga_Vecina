
import React from 'react';
import { ChargingPoint } from '../types';
import ChargerCard from './ChargerCard';
import { MapPinIcon } from './icons/MapPinIcon';

interface ChargerMapProps {
  chargers: ChargingPoint[];
  selectedCharger: ChargingPoint | null;
  onSelectCharger: (charger: ChargingPoint) => void;
}

const ChargerMap: React.FC<ChargerMapProps> = ({ chargers, selectedCharger, onSelectCharger }) => {
  // These are normalized coordinates (0-100) for positioning on a static image
  const getPosition = (lat: number, lng: number) => {
    // A simple normalization function. In a real app, this would be more complex.
    const latMin = -33.50, latMax = -33.40;
    const lngMin = -70.65, lngMax = -70.55;
    const top = 100 - ((lat - latMin) / (latMax - latMin)) * 100;
    const left = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[600px]">
      <div className="flex-grow bg-gray-300 rounded-lg shadow-inner overflow-hidden relative">
        <img 
          src="https://www.intro-webdesign.com/images/google-maps-api-santiago.jpg" 
          alt="Map of Santiago" 
          className="w-full h-full object-cover opacity-80"
        />
        {chargers.map(charger => {
          const { top, left } = getPosition(charger.lat, charger.lng);
          const isSelected = selectedCharger?.id === charger.id;
          return (
            <button
              key={charger.id}
              onClick={() => onSelectCharger(charger)}
              className="absolute transform -translate-x-1/2 -translate-y-full focus:outline-none"
              style={{ top, left }}
              aria-label={`Select ${charger.name}`}
            >
              <MapPinIcon 
                className={`h-10 w-10 transition-all duration-300 ${
                  isSelected ? 'text-brand-secondary scale-125 drop-shadow-lg' : 'text-brand-primary drop-shadow-md'
                }`} 
              />
              {isSelected && <span className="absolute -bottom-2 w-2 h-2 bg-brand-secondary rounded-full animate-ping"></span>}
            </button>
          );
        })}
      </div>
      <div className="md:w-1/3 xl:w-1/4 flex-shrink-0">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Detalles del Punto</h2>
        {selectedCharger ? (
          <ChargerCard charger={selectedCharger} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
            <p className="text-gray-500">Selecciona un punto en el mapa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargerMap;
