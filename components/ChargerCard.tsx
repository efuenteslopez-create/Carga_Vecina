
import React from 'react';
import { ChargingPoint } from '../types';
import { StarIcon } from './icons/StarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { PlugIcon } from './icons/PlugIcon';

interface ChargerCardProps {
  charger: ChargingPoint;
}

const ChargerCard: React.FC<ChargerCardProps> = ({ charger }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <img src={charger.imageUrl} alt={charger.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-brand-dark truncate">{charger.name}</h3>
        <p className="text-sm text-gray-500 flex items-center mt-1">
            <LocationIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{charger.address}</span>
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
            <PlugIcon className="h-4 w-4 mr-1.5 text-brand-secondary" />
            {charger.chargerType}
          </div>
          <div className="flex items-center text-sm font-bold text-brand-dark">
            <StarIcon className="h-5 w-5 text-amber-400 mr-1" />
            {charger.rating.toFixed(1)}
            <span className="text-gray-500 font-normal ml-1">({charger.reviewCount})</span>
          </div>
        </div>
        <div className="mt-4">
          <button className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors">
            Reservar por {charger.pricePerHour.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}/hr
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChargerCard;
