
import React, { useMemo } from 'react';
import { ChargingPoint, Booking, BookingStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { ClockIcon } from './icons/ClockIcon';
import { StarIcon } from './icons/StarIcon';
import { ChargerIcon } from './icons/ChargerIcon';

interface HostViewProps {
  chargers: ChargingPoint[];
  bookings: Booking[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className="bg-brand-primary/10 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-brand-dark">{value}</p>
        </div>
    </div>
);


const HostView: React.FC<HostViewProps> = ({ chargers, bookings }) => {
    const totalEarnings = useMemo(() => 
        bookings
            .filter(b => b.status === BookingStatus.Completed)
            .reduce((sum, b) => sum + b.totalCost * 0.85, 0) // Host gets 85%
            .toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }), 
        [bookings]
    );

    const upcomingBookingsCount = useMemo(() => 
        bookings.filter(b => b.status === BookingStatus.Confirmed && b.startTime > new Date()).length,
        [bookings]
    );
    
    const averageRating = useMemo(() => {
        if (chargers.length === 0) return 'N/A';
        const totalRating = chargers.reduce((sum, c) => sum + c.rating, 0);
        return (totalRating / chargers.length).toFixed(1);
    }, [chargers]);
    
    // Mock data for chart
    const monthlyEarningsData = [
        { name: 'Ene', Ganancias: 40000 },
        { name: 'Feb', Ganancias: 30000 },
        { name: 'Mar', Ganancias: 50000 },
        { name: 'Abr', Ganancias: 47800 },
        { name: 'May', Ganancias: 58900 },
        { name: 'Jun', Ganancias: 43900 },
    ];

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-brand-dark">Dashboard de Anfitrión</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Ganancias Totales (85%)" value={totalEarnings} icon={<DollarSignIcon className="h-6 w-6 text-brand-primary" />} />
            <StatCard title="Reservas Próximas" value={upcomingBookingsCount.toString()} icon={<ClockIcon className="h-6 w-6 text-brand-primary" />} />
            <StatCard title="Calificación Promedio" value={averageRating} icon={<StarIcon className="h-6 w-6 text-brand-primary" />} />
            <StatCard title="Puntos de Carga Activos" value={chargers.length.toString()} icon={<ChargerIcon className="h-6 w-6 text-brand-primary" />} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-brand-dark mb-4">Resumen de Ganancias</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyEarningsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${Number(value)/1000}k`} />
                        <Tooltip formatter={(value: number) => value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}/>
                        <Legend />
                        <Bar dataKey="Ganancias" fill="#10B981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-brand-dark mb-4">Mis Puntos de Carga</h2>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {chargers.map(charger => (
                        <div key={charger.id} className="p-4 border rounded-lg hover:bg-gray-50">
                            <p className="font-semibold text-brand-dark">{charger.name}</p>
                            <p className="text-sm text-gray-500">{charger.address}</p>
                            <div className="flex items-center justify-between mt-2 text-sm">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{charger.chargerType}</span>
                                <span className="font-bold text-brand-primary">{charger.rating} ★</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default HostView;
