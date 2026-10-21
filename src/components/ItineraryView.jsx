import React, { useState } from 'react';
import {
  Calendar, MapPin, Users, DollarSign, Clock, Sparkles, Bookmark, Check,
  Share2, Printer, Download, Plus, Trash2, Edit3, Bed, Utensils,
  Sun, Compass, AlertCircle, ArrowLeft, Lightbulb, CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function ItineraryView({
  itinerary,
  currency = 'USD',
  onSaveTrip,
  isSaved = false,
  onBack,
  onReplan,
}) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'all'
  const [activitiesState, setActivitiesState] = useState(itinerary.days);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // New activity form state for modal
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sightseeing');
  const [newTimeSlot, setNewTimeSlot] = useState('Afternoon');
  const [newLocation, setNewLocation] = useState('');
  const [newCost, setNewCost] = useState('0');
  const [newDesc, setNewDesc] = useState('');
  const [newTip, setNewTip] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Toggle activity completed
  const handleToggleCompleted = (dayIdx, actId) => {
    const updated = [...activitiesState];
    const act = updated[dayIdx].activities.find((a) => a.id === actId);
    if (act) {
      act.completed = !act.completed;
      setActivitiesState(updated);
    }
  };

  // Delete activity
  const handleDeleteActivity = (dayIdx, actId) => {
    const updated = [...activitiesState];
    updated[dayIdx].activities = updated[dayIdx].activities.filter((a) => a.id !== actId);
    setActivitiesState(updated);
    triggerToast('Activity removed from itinerary');
  };

  // Add new activity to current day
  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAct = {
      id: `act-custom-${Date.now()}`,
      timeSlot: newTimeSlot,
      time: newTimeSlot === 'Morning' ? '10:00 AM' : newTimeSlot === 'Lunch' ? '01:00 PM' : newTimeSlot === 'Afternoon' ? '03:30 PM' : '07:30 PM',
      title: newTitle.trim(),
      category: newCategory,
      location: newLocation.trim() || itinerary.destination,
      cost: parseFloat(newCost) || 0,
      description: newDesc.trim() || 'Custom activity planned for this day.',
      tip: newTip.trim() || 'Enjoy your visit!',
      completed: false,
    };

    const updated = [...activitiesState];
    updated[activeDayIndex].activities.push(newAct);
    setActivitiesState(updated);
    setShowAddActivityModal(false);
    setNewTitle('');
    setNewLocation('');
    setNewDesc('');
    setNewTip('');
    triggerToast('Added custom activity to Day ' + (activeDayIndex + 1));
  };

  // Copy shareable summary
  const handleShare = () => {
    const text = `✈️ My Trip Itinerary for ${itinerary.destination} (${itinerary.totalDays} Days)\n` +
      `Dates: ${itinerary.startDate} to ${itinerary.endDate}\n` +
      `Budget Style: ${itinerary.budget}\n` +
      `Planned on Wayfarer — AI Travel Itinerary Planner`;
    navigator.clipboard.writeText(text);
    triggerToast('Itinerary summary copied to clipboard!');
  };

  // Export JSON file
  const handleExportJSON = () => {
    const exportData = { ...itinerary, days: activitiesState };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wayfarer-${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Downloaded itinerary JSON file');
  };

  // Print as PDF
  const handlePrint = () => {
    window.print();
  };

  // Category badge colors
  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'sightseeing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'dining':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'experience':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'shopping':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'transport':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#144355] text-white px-5 py-3 rounded-2xl shadow-soft-lg flex items-center gap-2 text-sm font-bold border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Action Toolbar (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e8dfd0]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-[#5a6b73] hover:text-[#144355] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#d8cdbc] bg-white text-xs font-bold text-[#144355] hover:bg-[#f6f0e3] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#d8cdbc] bg-white text-xs font-bold text-[#144355] hover:bg-[#f6f0e3] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#d8cdbc] bg-white text-xs font-bold text-[#144355] hover:bg-[#f6f0e3] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => onSaveTrip({ ...itinerary, days: activitiesState })}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all ${
              isSaved
                ? 'bg-emerald-700 text-white'
                : 'bg-[#144355] hover:bg-[#0e3240] text-white hover:shadow'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Trips</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Itinerary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-soft-lg min-h-[300px] flex flex-col justify-end p-6 sm:p-10 text-white">
        <img
          src={itinerary.heroImage}
          alt={itinerary.destination}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-[#144355] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {itinerary.totalDays} Days Plan
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
              {itinerary.budget.toUpperCase()} Tier
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 capitalize">
              {itinerary.pace} Pace
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 capitalize">
              {itinerary.travelers} ({itinerary.groupSize})
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {itinerary.destination}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-white/90 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>
                {new Date(itinerary.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
                {new Date(itinerary.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-300" />
              <span>
                Est. Total: <strong>{formatCurrency(itinerary.budgetBreakdown.totalEstimated, currency)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Quick Insights Grid */}
      {itinerary.destinationOverview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e8dfd0] shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
              <Sun className="w-4 h-4" />
              <span>Best Season</span>
            </div>
            <p className="text-sm font-semibold text-[#144355]">
              {itinerary.destinationOverview.bestSeason}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e8dfd0] shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
              <Compass className="w-4 h-4" />
              <span>Transit Guide</span>
            </div>
            <p className="text-xs text-[#4a5c65] font-medium leading-relaxed">
              {itinerary.destinationOverview.transitTips}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e8dfd0] shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Local Currency</span>
            </div>
            <p className="text-sm font-semibold text-[#144355]">
              {itinerary.destinationOverview.currency}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e8dfd0] shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">
              <Lightbulb className="w-4 h-4" />
              <span>Weather & Tips</span>
            </div>
            <p className="text-xs text-[#4a5c65] font-medium leading-relaxed">
              {itinerary.destinationOverview.weatherSummary}
            </p>
          </div>
        </div>
      )}

      {/* Day Selector Tabs & View Toggle */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#144355]">Day-by-Day Itinerary</h2>
            <p className="text-xs text-[#5a6b73]">
              Chronological activities with timings, expenses, and pro-tips. Click to mark visited.
            </p>
          </div>

          <div className="no-print flex items-center gap-2">
            <div className="flex bg-[#f1ebd9] p-1 rounded-xl border border-[#e2d7c0] text-xs font-bold">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'single' ? 'bg-white text-[#144355] shadow-xs' : 'text-[#5a6b73]'
                }`}
              >
                Day by Day
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'all' ? 'bg-white text-[#144355] shadow-xs' : 'text-[#5a6b73]'
                }`}
              >
                View All Days
              </button>
            </div>

            <button
              onClick={() => setShowAddActivityModal(true)}
              className="flex items-center gap-1.5 bg-[#144355] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#0e3240] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stop</span>
            </button>
          </div>
        </div>

        {/* Day Horizontal Tabs */}
        {viewMode === 'single' && (
          <div className="no-print flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {activitiesState.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-3 rounded-2xl text-left border shrink-0 transition-all ${
                  activeDayIndex === idx
                    ? 'bg-[#144355] text-white border-[#144355] shadow-sm'
                    : 'bg-white text-[#4a5c65] border-[#e8dfd0] hover:bg-[#f8f4ec]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-extrabold text-sm">Day {day.dayNumber}</span>
                  <span className={`text-[11px] font-medium ${activeDayIndex === idx ? 'text-amber-300' : 'text-[#8697a0]'}`}>
                    {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className={`text-xs mt-1 truncate max-w-[180px] font-medium ${activeDayIndex === idx ? 'text-white/80' : 'text-[#8697a0]'}`}>
                  {day.theme}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Activities Timeline */}
      <div className="space-y-10">
        {(viewMode === 'single' ? [activitiesState[activeDayIndex]] : activitiesState).map((day, dIdx) => {
          const currentDayIndex = viewMode === 'single' ? activeDayIndex : dIdx;
          return (
            <div key={day.dayNumber} className="space-y-5 print-card">
              {/* Day Header */}
              <div className="bg-[#f5efe3] p-4 sm:p-5 rounded-2xl border border-[#e2d7c0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#144355] text-white text-xs font-black px-2.5 py-0.5 rounded-lg">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-xs font-bold text-[#5a6b73]">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#144355] mt-1">
                    {day.theme}
                  </h3>
                </div>

                <div className="text-xs font-semibold text-[#5a6b73]">
                  {day.activities.length} stops planned
                </div>
              </div>

              {/* Day's Activities List */}
              <div className="space-y-4">
                {day.activities.map((act) => (
                  <div
                    key={act.id}
                    className={`bg-white rounded-2xl border transition-all p-5 shadow-soft flex flex-col sm:flex-row gap-4 sm:gap-6 ${
                      act.completed
                        ? 'border-emerald-300 bg-emerald-50/20 opacity-75'
                        : 'border-[#e8dfd0] hover:border-[#144355]'
                    }`}
                  >
                    {/* Time Slot Column */}
                    <div className="sm:w-36 shrink-0 flex sm:flex-col justify-between sm:justify-start items-start gap-1">
                      <span className="text-xs font-black text-amber-700 uppercase tracking-wider block">
                        {act.timeSlot}
                      </span>
                      <span className="text-sm font-extrabold text-[#144355]">
                        {act.time}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 ${getCategoryBadgeClass(act.category)}`}>
                        {act.category}
                      </span>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className={`text-base sm:text-lg font-bold text-[#144355] ${act.completed ? 'line-through text-stone-500' : ''}`}>
                            {act.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-[#5a6b73] mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{act.location}</span>
                          </div>
                        </div>

                        {/* Cost Tag */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#144355]">
                            {act.cost > 0 ? formatCurrency(act.cost, currency) : 'Free'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#4a5c65] leading-relaxed">
                        {act.description}
                      </p>

                      {/* Insider Tip Box */}
                      {act.tip && (
                        <div className="bg-[#fbf7ee] border border-[#e8dfd0] p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#5a6b73]">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#144355]">Insider Tip: </span>
                            <span>{act.tip}</span>
                          </div>
                        </div>
                      )}

                      {/* Interactive Controls (Hidden in Print) */}
                      <div className="no-print pt-2 flex items-center justify-between border-t border-[#f2ece1]">
                        <button
                          onClick={() => handleToggleCompleted(currentDayIndex, act.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                            act.completed ? 'text-emerald-700' : 'text-[#7d8f99] hover:text-[#144355]'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{act.completed ? 'Completed' : 'Mark as Visited'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteActivity(currentDayIndex, act.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended Hotels Section */}
      {itinerary.recommendedHotels && itinerary.recommendedHotels.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#e8dfd0] print-card">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-black text-[#144355]">
              Recommended Stays & Hotels
            </h3>
          </div>
          <p className="text-xs text-[#5a6b73]">
            Curated accommodations matched to your {itinerary.budget} budget and {itinerary.accommodation} preference.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {itinerary.recommendedHotels.map((hotel, hIdx) => (
              <div key={hIdx} className="bg-white p-5 rounded-2xl border border-[#e8dfd0] shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {hotel.type}
                  </span>
                  <span className="text-xs font-bold text-amber-600">★ {hotel.rating}</span>
                </div>
                <h4 className="font-bold text-base text-[#144355] leading-snug">
                  {hotel.name}
                </h4>
                <div className="text-xs text-[#5a6b73] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{hotel.area}</span>
                </div>
                <div className="pt-2 border-t border-[#f0e9dc] flex items-baseline justify-between">
                  <span className="text-xs text-[#7d8f99]">Nightly rate:</span>
                  <span className="text-base font-extrabold text-[#144355]">
                    {formatCurrency(hotel.pricePerNight, currency)}
                    <span className="text-[10px] text-[#7d8f99] font-normal"> / night</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Restaurants Section */}
      {itinerary.recommendedRestaurants && itinerary.recommendedRestaurants.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[#e8dfd0] print-card">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-black text-[#144355]">
              Curated Dining & Food Specialties
            </h3>
          </div>
          <p className="text-xs text-[#5a6b73]">
            Authentic dining spots and must-try regional delicacies for your trip.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {itinerary.recommendedRestaurants.map((dining, dIdx) => (
              <div key={dIdx} className="bg-white p-5 rounded-2xl border border-[#e8dfd0] shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {dining.type}
                  </span>
                  <span className="text-xs font-black text-[#144355]">{dining.priceRange}</span>
                </div>
                <h4 className="font-bold text-base text-[#144355]">
                  {dining.name}
                </h4>
                <p className="text-xs text-[#5a6b73]">
                  <strong>Signature Dish:</strong> {dining.dish}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Estimated Expenses Breakdown Widget */}
      {itinerary.budgetBreakdown && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8dfd0] shadow-soft space-y-6 print-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-black text-[#144355]">
                Estimated Expenses Breakdown
              </h3>
              <p className="text-xs text-[#5a6b73]">
                Estimated total for {itinerary.groupSize} {itinerary.groupSize === 1 ? 'traveller' : 'travellers'} over {itinerary.totalDays} days.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#7d8f99] block uppercase">Est. Total Trip Cost</span>
              <span className="text-2xl sm:text-3xl font-black text-[#144355]">
                {formatCurrency(itinerary.budgetBreakdown.totalEstimated, currency)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="bg-[#fbf9f4] p-3.5 rounded-2xl border border-[#ece4d5]">
              <span className="text-[11px] font-bold text-[#7d8f99] block">Accommodation (44%)</span>
              <span className="text-base font-extrabold text-[#144355] mt-1 block">
                {formatCurrency(itinerary.budgetBreakdown.accommodation, currency)}
              </span>
            </div>

            <div className="bg-[#fbf9f4] p-3.5 rounded-2xl border border-[#ece4d5]">
              <span className="text-[11px] font-bold text-[#7d8f99] block">Food & Dining (30%)</span>
              <span className="text-base font-extrabold text-[#144355] mt-1 block">
                {formatCurrency(itinerary.budgetBreakdown.foodAndDining, currency)}
              </span>
            </div>

            <div className="bg-[#fbf9f4] p-3.5 rounded-2xl border border-[#ece4d5]">
              <span className="text-[11px] font-bold text-[#7d8f99] block">Sights & Activities (14%)</span>
              <span className="text-base font-extrabold text-[#144355] mt-1 block">
                {formatCurrency(itinerary.budgetBreakdown.activitiesAndEntry, currency)}
              </span>
            </div>

            <div className="bg-[#fbf9f4] p-3.5 rounded-2xl border border-[#ece4d5]">
              <span className="text-[11px] font-bold text-[#7d8f99] block">Transport (8%)</span>
              <span className="text-base font-extrabold text-[#144355] mt-1 block">
                {formatCurrency(itinerary.budgetBreakdown.transport, currency)}
              </span>
            </div>

            <div className="bg-[#fbf9f4] p-3.5 rounded-2xl border border-[#ece4d5] col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-[#7d8f99] block">Buffer & Misc (4%)</span>
              <span className="text-base font-extrabold text-[#144355] mt-1 block">
                {formatCurrency(itinerary.budgetBreakdown.buffer, currency)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Add Custom Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-soft-lg animate-fadeIn border border-[#e8dfd0]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#144355]">Add Activity to Day {activeDayIndex + 1}</h3>
                <p className="text-xs text-[#5a6b73]">Insert a custom attraction, dining reservation, or leisure stop.</p>
              </div>
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#144355] mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Tea at Historic Palace"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7] text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#144355] mb-1">Time Slot</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7]"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#144355] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7]"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Dining">Dining</option>
                    <option value="Experience">Experience</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transport">Transport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#144355] mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Square"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7]"
                  />
                </div>

                <div>
                  <label className="block text-[#144355] mb-1">Est. Cost ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#144355] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Notes about what to do, see, or expect..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7]"
                />
              </div>

              <div>
                <label className="block text-[#144355] mb-1">Pro Tip (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Book in advance or visit at sunset"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#d8cdbc] text-[#5a6b73] hover:bg-[#f6f0e3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#144355] text-white font-bold hover:bg-[#0e3240]"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
