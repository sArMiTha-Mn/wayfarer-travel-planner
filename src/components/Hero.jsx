import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, DollarSign, Utensils, Compass } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function Hero({ destinations = [], onSelectDestination, onPlanWithDestination, currency }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'Asia', 'Europe', 'North America', 'Middle East & Africa'];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-ocean-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1ebd9] border border-[#e2d7c0] text-[#144355] text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Travel Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#144355] leading-[1.12]">
            Plan a personalised trip <br className="hidden sm:inline" />
            <span className="text-amber-700">in under two minutes</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[#4a5c65] max-w-2xl mx-auto leading-relaxed">
            Day-by-day itineraries with sights, dining, stays, and transport tailored to your dates, budget, and travel style.
          </p>

          {/* Quick Search & Start Bar */}
          <div className="mt-10 max-w-2xl mx-auto bg-white rounded-2xl p-2 sm:p-2.5 shadow-soft-lg border border-[#e8dfd0] flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-3.5 py-2">
              <Search className="w-5 h-5 text-[#8697a0] mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Where to? (e.g., Tokyo, Paris, Bali, Rome, Iceland...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    onPlanWithDestination(searchQuery.trim());
                  }
                }}
                className="w-full text-base bg-transparent text-[#144355] placeholder-[#8697a0] focus:outline-none font-medium"
              />
            </div>
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  onPlanWithDestination(searchQuery.trim());
                } else {
                  onPlanWithDestination('Tokyo, Japan');
                }
              }}
              className="bg-[#144355] hover:bg-[#0e3240] text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-md"
            >
              <span>Build Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature Highlights Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-2.5 bg-[#f6f1e5]/80 border border-[#e8dfd0] px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#144355]">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Day-by-Day Flow</span>
            </div>
            <div className="flex items-center gap-2.5 bg-[#f6f1e5]/80 border border-[#e8dfd0] px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#144355]">
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Budget Forecasting</span>
            </div>
            <div className="flex items-center gap-2.5 bg-[#f6f1e5]/80 border border-[#e8dfd0] px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#144355]">
              <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Local Food & Stays</span>
            </div>
            <div className="flex items-center gap-2.5 bg-[#f6f1e5]/80 border border-[#e8dfd0] px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#144355]">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Print & Offline PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Curated Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Inspiration</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#144355] mt-1">
              Curated World Destinations
            </h2>
            <p className="text-sm text-[#5a6b73] mt-1">
              Handcrafted routes, verified attractions, local eats, and verified daily budgets.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#f1ebd9] p-1 rounded-xl border border-[#e2d7c0]">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRegion === region
                    ? 'bg-white text-[#144355] shadow-xs'
                    : 'text-[#5a6b73] hover:text-[#144355]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8dfd0] shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden bg-stone-200">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Region & Country Pill */}
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  {dest.country}
                </div>

                {/* Name & Season in image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-2xl font-black tracking-tight leading-none drop-shadow-sm">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-white/90 font-medium mt-1 truncate">
                    Best: {dest.bestSeasons}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#4a5c65] line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5">
                  {dest.highlights.slice(0, 3).map((hl, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-[#f5efe3] text-[#144355] px-2.5 py-1 rounded-md border border-[#e8dfd0]"
                    >
                      {hl}
                    </span>
                  ))}
                  {dest.highlights.length > 3 && (
                    <span className="text-[11px] font-medium text-[#7d8f99] px-1 py-1">
                      +{dest.highlights.length - 3} more
                    </span>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-[#f0e9dc] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7d8f99] block tracking-wide">
                      Avg. Daily Spend
                    </span>
                    <span className="text-base font-extrabold text-[#144355]">
                      {formatCurrency(dest.dailyBudgetEstimatedUSD.balanced, currency)}
                      <span className="text-xs font-normal text-[#7d8f99]"> / day</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="px-3 py-2 text-xs font-bold text-[#144355] hover:bg-[#f5efe3] rounded-xl border border-[#e2d7c0] transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onPlanWithDestination(`${dest.name}, ${dest.country}`)}
                      className="px-3.5 py-2 text-xs font-bold bg-[#144355] hover:bg-[#0e3240] text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Plan Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#144355] text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Effortless Planning
            </span>
            <h2 className="text-3xl font-extrabold mt-1">How Wayfarer Works</h2>
            <p className="text-sm text-white/80 mt-2">
              From your initial idea to a complete, stress-free day-by-day itinerary in 3 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#144355] font-extrabold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Tell Us Your Style</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Choose your destination, travel dates, who is coming along, and set your pace from relaxed coffee strolls to packed adventure days.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#144355] font-extrabold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">AI Builds Your Journey</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                We generate chronological morning-to-night plans, select neighborhood boutique hotels, handpick top dining, and calculate costs.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#144355] font-extrabold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Save, Edit & Travel</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Customize any activity, check off visited spots on your phone, export as a clean travel PDF, or share with friends.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
