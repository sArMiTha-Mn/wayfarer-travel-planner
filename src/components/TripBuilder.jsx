import React, { useState, useEffect } from 'react';
import {
  MapPin, Calendar, Users, DollarSign, Gauge, Home, Heart,
  Sparkles, ArrowRight, Check, Info, Loader2, Minus, Plus
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function TripBuilder({
  initialDestination = '',
  destinations = [],
  currency = 'USD',
  onGenerate,
  isLoading = false,
}) {
  // Form State
  const [destination, setDestination] = useState(initialDestination || 'Tokyo, Japan');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('couple');
  const [groupSize, setGroupSize] = useState(2);
  const [budget, setBudget] = useState('balanced');
  const [pace, setPace] = useState('balanced');
  const [accommodation, setAccommodation] = useState('boutique');
  const [interests, setInterests] = useState(['Culinary', 'Culture', 'Photography']);
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Set default dates (starting 14 days from now for a 5-day trip)
  useEffect(() => {
    if (!startDate) {
      const start = new Date();
      start.setDate(start.getDate() + 14);
      const end = new Date(start);
      end.setDate(start.getDate() + 5);

      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate]);

  // Update destination if passed from parent
  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  // Calculate day count
  const calculateDays = () => {
    if (!startDate || !endDate) return 5;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(14, diff || 5));
  };

  const daysCount = calculateDays();

  // Set preset days
  const handlePresetDays = (days) => {
    const s = startDate ? new Date(startDate) : new Date();
    const e = new Date(s);
    e.setDate(s.getDate() + (days - 1));
    setEndDate(e.toISOString().split('T')[0]);
  };

  // Autocomplete suggestions
  const handleDestinationChange = (val) => {
    setDestination(val);
    if (val.trim().length > 1) {
      const matches = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(val.toLowerCase()) ||
          d.country.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Toggle interest
  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== tag));
      }
    } else {
      setInterests([...interests, tag]);
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      destination: destination.trim() || 'Tokyo, Japan',
      startDate,
      endDate,
      daysCount,
      travelers,
      groupSize,
      budget,
      currency,
      pace,
      accommodation,
      interests,
      notes,
    });
  };

  // Options configuration matching inspected site
  const budgetOptions = [
    { value: 'budget', label: 'Budget', hint: 'Hostels, street food, local transport' },
    { value: 'balanced', label: 'Balanced', hint: 'Mid-range stays, a mix of dining' },
    { value: 'comfort', label: 'Comfort', hint: 'Boutique stays, curated dining' },
    { value: 'luxury', label: 'Luxury', hint: 'Premium stays, fine dining, private transfers' },
  ];

  const paceOptions = [
    { value: 'relaxed', label: 'Relaxed', hint: '2–3 stops a day, long lunches' },
    { value: 'balanced', label: 'Balanced', hint: '3–4 stops a day, great flow' },
    { value: 'packed', label: 'Packed', hint: '5–6 stops a day, early starts' },
  ];

  const travelerOptions = [
    { value: 'solo', label: 'Solo', defaultSize: 1 },
    { value: 'couple', label: 'Couple', defaultSize: 2 },
    { value: 'family', label: 'Family', defaultSize: 4 },
    { value: 'friends', label: 'Friends', defaultSize: 3 },
  ];

  const accommodationOptions = [
    { value: 'boutique', label: 'Boutique stay' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'resort', label: 'Resort' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'guesthouse', label: 'Guesthouse / homestay' },
    { value: 'any', label: 'No preference' },
  ];

  const availableInterests = [
    'Culinary', 'Culture', 'Nature', 'Adventure', 'Art & Museums',
    'Nightlife', 'Relaxation', 'Photography', 'Shopping', 'Scenic'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Smart Trip Builder
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#144355] mt-1">
          Tell us about your trip
        </h1>
        <p className="text-sm sm:text-base text-[#5a6b73] mt-2">
          Pick a destination, your dates, and what you enjoy, and your first itinerary will be ready in under a minute.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (8 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#e8dfd0] shadow-soft">
          {/* 1. Destination Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-[#144355]">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Where are you going?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                placeholder="City, region, or country (e.g. Tokyo, Paris, Bali, Amalfi Coast)"
                className="w-full px-4 py-3.5 rounded-2xl border border-[#d8cdbc] bg-[#fdfbf7] text-[#144355] font-semibold focus:outline-none focus:ring-2 focus:ring-[#144355] focus:border-transparent text-base transition-all"
                required
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-soft-lg border border-[#e8dfd0] overflow-hidden z-30">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => {
                        setDestination(`${s.name}, ${s.country}`);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-[#f6f0e3] flex items-center justify-between border-b border-[#f2ece1] last:border-0"
                    >
                      <div>
                        <span className="font-bold text-[#144355] text-sm block">{s.name}</span>
                        <span className="text-xs text-[#5a6b73]">{s.country} • {s.region}</span>
                      </div>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        Curated
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-[#7d8f99]">Quick pick:</span>
              {['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia', 'Swiss Alps', 'New York, USA'].map((city) => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setDestination(city)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    destination.toLowerCase().includes(city.split(',')[0].toLowerCase())
                      ? 'bg-[#144355] text-white border-[#144355]'
                      : 'bg-[#f8f4ec] text-[#4a5c65] border-[#e8dfd0] hover:bg-[#efe7d8]'
                  }`}
                >
                  {city.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Dates & Duration */}
          <div className="space-y-3 pt-4 border-t border-[#f0e9dc]">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-[#144355]">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>When are you travelling?</span>
              </label>
              <span className="text-xs font-extrabold text-[#144355] bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                {daysCount} {daysCount === 1 ? 'Day' : 'Days'} Itinerary
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-[#5a6b73] mb-1.5">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7] text-[#144355] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#144355]"
                  required
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#5a6b73] mb-1.5">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8cdbc] bg-[#fdfbf7] text-[#144355] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#144355]"
                  required
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs font-medium text-[#7d8f99] py-1">Presets:</span>
              {[3, 5, 7, 10, 14].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => handlePresetDays(d)}
                  className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${
                    daysCount === d
                      ? 'bg-[#144355] text-white border-[#144355]'
                      : 'bg-[#f8f4ec] text-[#4a5c65] border-[#e8dfd0] hover:bg-[#efe7d8]'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* 3. Who is travelling? */}
          <div className="space-y-3 pt-4 border-t border-[#f0e9dc]">
            <label className="flex items-center gap-2 text-sm font-bold text-[#144355]">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Who is travelling?</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {travelerOptions.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => {
                    setTravelers(t.value);
                    setGroupSize(t.defaultSize);
                  }}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    travelers === t.value
                      ? 'border-[#144355] bg-[#144355] text-white shadow-xs font-bold'
                      : 'border-[#e8dfd0] bg-[#fdfbf7] text-[#394a52] hover:bg-[#f5efe3] font-semibold'
                  }`}
                >
                  <span className="block text-sm">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Group Size Stepper */}
            <div className="flex items-center justify-between bg-[#f8f4ec] p-3 rounded-2xl border border-[#e8dfd0] mt-2">
              <span className="text-xs font-bold text-[#144355]">Total Travellers:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-[#d8cdbc] flex items-center justify-center text-[#144355] hover:bg-stone-50 font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-extrabold text-[#144355] w-6 text-center">{groupSize}</span>
                <button
                  type="button"
                  onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-[#d8cdbc] flex items-center justify-center text-[#144355] hover:bg-stone-50 font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Budget Tier */}
          <div className="space-y-3 pt-4 border-t border-[#f0e9dc]">
            <label className="flex items-center gap-2 text-sm font-bold text-[#144355]">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Travel Budget Style</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {budgetOptions.map((b) => (
                <div
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    budget === b.value
                      ? 'border-[#144355] bg-[#eef5f7] ring-2 ring-[#144355]'
                      : 'border-[#e8dfd0] bg-[#fdfbf7] hover:bg-[#f6f1e5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#144355]">{b.label}</span>
                    {budget === b.value && <Check className="w-4 h-4 text-[#144355]" />}
                  </div>
                  <p className="text-xs text-[#5a6b73] mt-1 leading-normal">{b.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Travel Pace */}
          <div className="space-y-3 pt-4 border-t border-[#f0e9dc]">
            <label className="flex items-center gap-2 text-sm font-bold text-[#144355]">
              <Gauge className="w-4 h-4 text-amber-600" />
              <span>Travel Pace</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {paceOptions.map((p) => (
                <div
                  key={p.value}
                  onClick={() => setPace(p.value)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    pace === p.value
                      ? 'border-[#144355] bg-[#eef5f7] ring-2 ring-[#144355]'
                      : 'border-[#e8dfd0] bg-[#fdfbf7] hover:bg-[#f6f1e5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#144355]">{p.label}</span>
                    {pace === p.value && <Check className="w-3.5 h-3.5 text-[#144355]" />}
                  </div>
                  <p className="text-xs text-[#5a6b73] mt-1">{p.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Accommodation Preference */}
          <div className="space-y-3 pt-4 border-t border-[#f0e9dc]">
            <label className="flex items-center gap-2 text-sm font-bold text-[#144355]">
              <Home className="w-4 h-4 text-amber-600" />
              <span>Accommodation Preference</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {accommodationOptions.map((acc) => (
                <button
                  type="button"
                  key={acc.value}
                  onClick={() => setAccommodation(acc.value)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    accommodation === acc.value
                      ? 'bg-[#144355] text-white border-[#144355]'
                      : 'bg-[#fdfbf7] text-[#4a5c65] border-[#e8dfd0] hover:bg-[#f6f1e5]'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. What do you love? (Interests) */}
          <div className="space-y-3 pt-4 border-t border-[#f0e9dc]">
            <label className="flex items-center gap-2 text-sm font-bold text-[#144355]">
              <Heart className="w-4 h-4 text-amber-600" />
              <span>What do you love? (Select at least 1)</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {availableInterests.map((tag) => {
                const isSelected = interests.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#144355] text-white shadow-xs'
                        : 'bg-[#f7f2e7] text-[#4a5c65] hover:bg-[#efe7d8] border border-[#e2d7c0]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. Special Requests & Notes */}
          <div className="space-y-2 pt-4 border-t border-[#f0e9dc]">
            <label className="text-xs font-bold text-[#144355]">
              Special Requests, Dietary Preferences, or Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Vegetarian dining options, travelling with a toddler, love sunset spots, prefer walking over taxis..."
              className="w-full px-4 py-2.5 rounded-2xl border border-[#d8cdbc] bg-[#fdfbf7] text-[#144355] text-sm focus:outline-none focus:ring-2 focus:ring-[#144355]"
            />
          </div>

          {/* Generate Button on Mobile */}
          <div className="pt-4 lg:hidden">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-[#144355] hover:bg-[#0e3240] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-soft transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                  <span>Planning your trip…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Generate my itinerary</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sidebar Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-[#144355] text-white rounded-3xl p-6 shadow-soft-lg space-y-6">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-amber-300 uppercase">
                Trip Overview
              </span>
              <h3 className="text-2xl font-black mt-1 leading-tight text-white">
                {destination || 'Select a destination'}
              </h3>
            </div>

            <div className="space-y-3 divide-y divide-white/10 text-xs">
              <div className="flex items-center justify-between pt-2">
                <span className="text-white/70 font-medium">Duration:</span>
                <span className="font-bold text-white">{daysCount} Days</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-white/70 font-medium">Dates:</span>
                <span className="font-bold text-white">
                  {startDate ? new Date(startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'} –{' '}
                  {endDate ? new Date(endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-white/70 font-medium">Travelers:</span>
                <span className="font-bold text-white capitalize">{travelers} ({groupSize})</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-white/70 font-medium">Budget Style:</span>
                <span className="font-bold text-amber-300 capitalize">{budget}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-white/70 font-medium">Pace:</span>
                <span className="font-bold text-white capitalize">{pace}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-white/70 font-medium">Stay Type:</span>
                <span className="font-bold text-white capitalize">{accommodation}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#144355] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Planning your trip…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#144355]" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-white/60 text-center leading-relaxed">
              Instant generation with day-by-day sights, curated dining, and cost estimation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
