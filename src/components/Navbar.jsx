import React, { useState } from 'react';
import { Compass, Sparkles, BookmarkCheck, Plus, Globe2, Menu, X } from 'lucide-react';
import { supportedCurrencies } from '../utils/currency';

export default function Navbar({ activeTab, setActiveTab, savedCount = 0, currency, setCurrency, onStartNewTrip }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#ece6d9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            onClick={() => {
              setActiveTab('explore');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#144355] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#144355] block leading-tight">
                Wayfarer
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 block">
                AI Travel Planner
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f3ede1]/80 p-1.5 rounded-2xl border border-[#e5dccb]">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'bg-white text-[#144355] shadow-sm'
                  : 'text-[#5a6b73] hover:text-[#144355] hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'builder'
                  ? 'bg-white text-[#144355] shadow-sm'
                  : 'text-[#5a6b73] hover:text-[#144355] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Trip Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'saved'
                  ? 'bg-white text-[#144355] shadow-sm'
                  : 'text-[#5a6b73] hover:text-[#144355] hover:bg-white/50'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Saved Trips</span>
              {savedCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-[#144355] text-white">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Actions & Currency Selector */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency selector */}
            <div className="relative flex items-center bg-[#f3ede1] rounded-xl px-2.5 py-1.5 border border-[#e5dccb]">
              <Globe2 className="w-4 h-4 text-[#5a6b73] mr-1.5" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#144355] focus:outline-none cursor-pointer pr-1"
                aria-label="Select Currency"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan New Trip CTA */}
            <button
              onClick={onStartNewTrip}
              className="flex items-center gap-2 bg-[#144355] hover:bg-[#0e3240] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Itinerary</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#f3ede1] text-xs font-bold text-[#144355] rounded-lg px-2 py-1.5 border border-[#e5dccb] focus:outline-none"
            >
              {supportedCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#144355] hover:bg-[#efe7d8] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#ece6d9] bg-[#fdfbf7] px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          <button
            onClick={() => {
              setActiveTab('explore');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
              activeTab === 'explore' ? 'bg-[#144355] text-white' : 'text-[#394a52] hover:bg-[#f3ede1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5" />
              <span>Explore Destinations</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('builder');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
              activeTab === 'builder' ? 'bg-[#144355] text-white' : 'text-[#394a52] hover:bg-[#f3ede1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Smart Trip Builder</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('saved');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
              activeTab === 'saved' ? 'bg-[#144355] text-white' : 'text-[#394a52] hover:bg-[#f3ede1]'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookmarkCheck className="w-5 h-5" />
              <span>Saved Itineraries</span>
            </div>
            {savedCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-stone-900">
                {savedCount}
              </span>
            )}
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                onStartNewTrip();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#144355] text-white font-bold py-3 rounded-xl shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Plan New Itinerary</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
