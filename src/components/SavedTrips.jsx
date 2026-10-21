import React, { useState } from 'react';
import { BookmarkCheck, Calendar, Users, DollarSign, ArrowRight, Trash2, Copy, Search, Plus, Compass } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function SavedTrips({
  trips = [],
  onOpenTrip,
  onDeleteTrip,
  onDuplicateTrip,
  onStartNewTrip,
  currency = 'USD',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tripToDelete, setTripToDelete] = useState(null);

  const filteredTrips = trips.filter((t) =>
    t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.budget?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e8dfd0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Personal Itineraries
          </span>
          <h1 className="text-3xl font-black text-[#144355] mt-1">Your Trips</h1>
          <p className="text-xs sm:text-sm text-[#5a6b73] mt-1">
            Open a trip to view day-by-day schedules, edit activities, or export to PDF.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#8697a0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#d8cdbc] bg-white text-xs font-semibold text-[#144355] focus:outline-none focus:ring-2 focus:ring-[#144355]"
            />
          </div>

          <button
            onClick={onStartNewTrip}
            className="flex items-center gap-2 bg-[#144355] hover:bg-[#0e3240] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Trip</span>
          </button>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#e8dfd0] shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-48 bg-stone-200">
                <img
                  src={trip.heroImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Duration Badge */}
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {trip.totalDays} Days
                </div>

                {/* Destination name */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-xl font-black leading-tight drop-shadow-sm">
                    {trip.destination}
                  </h3>
                  <p className="text-xs text-white/80 font-medium mt-0.5">
                    {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
                    {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Trip details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#f9f6ef] p-2.5 rounded-xl border border-[#ece4d5]">
                    <span className="text-[10px] uppercase font-bold text-[#7d8f99] block">Travelers</span>
                    <span className="font-extrabold text-[#144355] capitalize">
                      {trip.travelers} ({trip.groupSize})
                    </span>
                  </div>

                  <div className="bg-[#f9f6ef] p-2.5 rounded-xl border border-[#ece4d5]">
                    <span className="text-[10px] uppercase font-bold text-[#7d8f99] block">Budget Style</span>
                    <span className="font-extrabold text-[#144355] capitalize">
                      {trip.budget}
                    </span>
                  </div>
                </div>

                {/* Total budget estimate */}
                {trip.budgetBreakdown?.totalEstimated && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#7d8f99] font-medium">Estimated Budget:</span>
                    <span className="font-extrabold text-sm text-[#144355]">
                      {formatCurrency(trip.budgetBreakdown.totalEstimated, currency)}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 border-t border-[#f0e9dc] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDuplicateTrip(trip)}
                      className="p-2 text-[#5a6b73] hover:text-[#144355] hover:bg-[#f6f0e3] rounded-xl transition-colors"
                      title="Duplicate this trip"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setTripToDelete(trip)}
                      className="p-2 text-[#5a6b73] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenTrip(trip)}
                    className="flex items-center gap-1.5 bg-[#144355] hover:bg-[#0e3240] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-[#e8dfd0] shadow-soft space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#f5efe3] text-[#144355] flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#144355]">No trips yet</h3>
            <p className="text-xs sm:text-sm text-[#5a6b73] mt-1 max-w-sm mx-auto">
              Build a new itinerary in a couple of minutes and keep it saved here on your account.
            </p>
          </div>
          <button
            onClick={onStartNewTrip}
            className="inline-flex items-center gap-2 bg-[#144355] hover:bg-[#0e3240] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-md transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Itinerary</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-soft-lg border border-[#e8dfd0]">
            <h3 className="text-lg font-bold text-[#144355]">Delete this trip?</h3>
            <p className="text-xs text-[#5a6b73]">
              The trip to <strong>{tripToDelete.destination}</strong> and all of its days will be removed. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTripToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#d8cdbc] text-xs font-bold text-[#5a6b73] hover:bg-[#f8f4ec]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTrip(tripToDelete.id);
                  setTripToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
