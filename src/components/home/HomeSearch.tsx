"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Bell, Pill, AlertTriangle, CheckCircle, Clock, ArrowRight, ChevronRight, Store } from "lucide-react";
import PharmacyList from "@/components/PharmacyList";
import AlternativesList from "@/components/AlternativesList";

interface Medication {
  id: string;
  name: string;
  laboratory?: string;
  status: "AVAILABLE" | "TENSION" | "RUPTURE" | "UNKNOWN";
  activeIngredient?: string;
}

const statusConfig = {
  AVAILABLE: { label: "Disponible", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: CheckCircle, iconBg: "bg-emerald-500" },
  TENSION: { label: "Tension", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: Clock, iconBg: "bg-amber-500" },
  RUPTURE: { label: "Rupture", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: AlertTriangle, iconBg: "bg-rose-500" },
  UNKNOWN: { label: "Inconnu", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: Pill, iconBg: "bg-gray-500" }
};

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<Medication[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    try {
      const r = await fetch("/api/suggestions?q=" + encodeURIComponent(searchQuery));
      const data = await r.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (e) { console.error(e); setSuggestions([]); }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2 && !searched) fetchSuggestions(query);
      else { setSuggestions([]); setShowSuggestions(false); }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [query, fetchSuggestions, searched]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((p) => (p < suggestions.length - 1 ? p + 1 : p)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((p) => (p > 0 ? p - 1 : -1)); }
    else if (e.key === "Enter" && selectedIndex >= 0) { e.preventDefault(); selectSuggestion(suggestions[selectedIndex]); }
    else if (e.key === "Escape") setShowSuggestions(false);
  };

  const selectSuggestion = (medication: Medication) => {
    setQuery(medication.name); setShowSuggestions(false); setSuggestions([]);
    setResults([medication]); setSearched(true); setSelectedMedication(medication);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;
    setLoading(true); setShowSuggestions(false); setSelectedMedication(null);
    try {
      const r = await fetch("/api/search?q=" + encodeURIComponent(query));
      const data = await r.json();
      const medications = data.medications || [];
      setResults(medications); setSearched(true);
      if (medications.length === 1) setSelectedMedication(medications[0]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (searched) { setSearched(false); setResults([]); setSelectedMedication(null); }
  };

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 relative z-40">
        <div className="relative z-50" ref={searchContainerRef}>
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full blur opacity-20"></div>
          <div className="relative flex items-center bg-white rounded-full shadow-xl shadow-gray-200/50 border border-gray-100">
            <Search className="absolute left-6 h-6 w-6 text-gray-400" />
            <input type="text" placeholder="Rechercher un medicament (ex: Ozempic, Doliprane...)" value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} className="w-full py-5 pl-16 pr-52 text-lg rounded-full border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 text-ellipsis overflow-hidden" />
            <button type="submit" disabled={loading || query.length < 2} className="absolute right-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span>Rechercher</span><ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
              {suggestions.map((med, index) => {
                const config = statusConfig[med.status];
                const Icon = config.icon;
                return (
                  <button key={med.id} type="button" onClick={() => selectSuggestion(med)} className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left ${index === selectedIndex ? 'bg-teal-50' : ''} ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}><Icon className="h-5 w-5 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-900 truncate">{med.name}</span><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span></div>
                      <p className="text-sm text-gray-500 truncate">{med.laboratory}{med.activeIngredient && <span className="text-gray-400"> • {med.activeIngredient}</span>}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </form>

      {/* Results */}
      {searched && (
        <div className="max-w-2xl mx-auto text-left animate-slide-up">
          {results.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun medicament trouve pour &quot;{query}&quot;</p>
              <p className="text-gray-400 text-sm mt-2">Essayez avec un autre nom ou molecule</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 font-medium">{results.length} resultat(s) pour &quot;{query}&quot;</p>
              {results.map((med, index) => {
                const config = statusConfig[med.status];
                const Icon = config.icon;
                return (
                  <div key={med.id} className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${med.status === "RUPTURE" ? "border-l-4 border-l-rose-500" : med.status === "TENSION" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-500"}`} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{med.name}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.border} border ${config.text}`}><Icon className="h-3.5 w-3.5" />{config.label}</span>
                        </div>
                        <p className="text-gray-500">{med.laboratory}{med.activeIngredient && <span className="text-gray-400"> &bull; {med.activeIngredient}</span>}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedMedication(selectedMedication?.id === med.id ? null : med)} className={`flex items-center gap-2 px-4 py-2.5 font-semibold rounded-xl transition-all duration-200 ${selectedMedication?.id === med.id ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}><Store className="h-4 w-4" />Pharmacies</button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200"><Bell className="h-4 w-4" />Alerte</button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {selectedMedication && (
                <div className="mt-6 animate-slide-up">
                  <PharmacyList medicationId={selectedMedication.id} medicationName={selectedMedication.name} />
                </div>
              )}

              {selectedMedication && (selectedMedication.status === "RUPTURE" || selectedMedication.status === "TENSION") && (
                <div className="mt-6 animate-slide-up">
                  <AlternativesList medicationId={selectedMedication.id} medicationName={selectedMedication.name} onSelectAlternative={(alt) => {
                    setQuery(alt.name);
                    setResults([{ id: alt.id, name: alt.name, laboratory: alt.laboratory || undefined, status: alt.status as "AVAILABLE" | "TENSION" | "RUPTURE" | "UNKNOWN", activeIngredient: alt.activeIngredient || undefined }]);
                    setSelectedMedication({ id: alt.id, name: alt.name, laboratory: alt.laboratory || undefined, status: alt.status as "AVAILABLE" | "TENSION" | "RUPTURE" | "UNKNOWN", activeIngredient: alt.activeIngredient || undefined });
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick suggestions when not searched */}
      {!searched && (
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-gray-500 text-sm">Recherches populaires:</span>
          {["Ozempic", "Doliprane", "Levothyrox", "Amoxicilline"].map((term) => (
            <button key={term} onClick={() => setQuery(term)} className="px-4 py-1.5 bg-white rounded-full text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 transition-colors">{term}</button>
          ))}
        </div>
      )}
    </>
  );
}
