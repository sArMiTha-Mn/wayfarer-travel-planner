import React from 'react';
import { X, Calendar, MapPin, Compass, DollarSign, Bed, Utensils, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function DestinationModal({ destination, onClose, onPlanWithDestination, currency = 'USD' }) {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-soft-lg my-8 border border-[#e8dfd0] animate-fadeIn">
        {/* Modal Banner */}
        <div className="relative h-64 sm:h-72">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {destination.country} • {destination.region}
            </span>
            <h3 className="text-3xl font-black mt-0.5">{destination.name}</h3>
            <p className="text-xs text-white/90 font-medium mt-1">
              Best season: {destination.bestSeasons}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
          {/* Tagline */}
          <p className="text-sm sm:text-base text-[#4a5c65] font-medium leading-relaxed">
            {destination.tagline}
          </p>

          {/* Highlights */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-[#144355] uppercase tracking-wide">
              Top Sights & Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {destination.highlights.map((hl, i) => (
                <span
                  key={i}
                  className="bg-[#f5efe3] text-[#144355] px-3 py-1.5 rounded-xl border border-[#e2d7c0] font-semibold text-xs"
                >
                  {hl}
                </span>
              ))}
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-[#144355] uppercase tracking-wide">
              Estimated Daily Spend (Per Person)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#fcfaf6] p-3 rounded-xl border border-[#e8dfd0]">
                <span className="text-[10px] font-bold text-[#7d8f99] uppercase block">Budget</span>
                <span className="font-extrabold text-[#144355] text-sm mt-0.5 block">
                  {formatCurrency(destination.dailyBudgetEstimatedUSD.budget, currency)}
                </span>
              </div>
              <div className="bg-[#fcfaf6] p-3 rounded-xl border border-[#e8dfd0]">
                <span className="text-[10px] font-bold text-[#7d8f99] uppercase block">Balanced</span>
                <span className="font-extrabold text-[#144355] text-sm mt-0.5 block">
                  {formatCurrency(destination.dailyBudgetEstimatedUSD.balanced, currency)}
                </span>
              </div>
              <div className="bg-[#fcfaf6] p-3 rounded-xl border border-[#e8dfd0]">
                <span className="text-[10px] font-bold text-[#7d8f99] uppercase block">Comfort</span>
                <span className="font-extrabold text-[#144355] text-sm mt-0.5 block">
                  {formatCurrency(destination.dailyBudgetEstimatedUSD.comfort, currency)}
                </span>
              </div>
              <div className="bg-[#fcfaf6] p-3 rounded-xl border border-[#e8dfd0]">
                <span className="text-[10px] font-bold text-[#7d8f99] uppercase block">Luxury</span>
                <span className="font-extrabold text-[#144355] text-sm mt-0.5 block">
                  {formatCurrency(destination.dailyBudgetEstimatedUSD.luxury, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Transit Advice */}
          <div className="bg-[#f8f5ee] p-4 rounded-2xl border border-[#e8dfd0] space-y-1">
            <span className="text-xs font-bold text-[#144355] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Getting Around & Local Transit</span>
            </span>
            <p className="text-xs text-[#5a6b73] leading-relaxed">
              {destination.transitTips}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#faf7f2] border-t border-[#e8dfd0] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#d8cdbc] text-xs font-bold text-[#5a6b73] hover:bg-[#efe7d8] transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onPlanWithDestination(`${destination.name}, ${destination.country}`);
              onClose();
            }}
            className="flex items-center gap-2 bg-[#144355] hover:bg-[#0e3240] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <span>Plan Itinerary for {destination.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
