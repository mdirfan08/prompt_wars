import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../constants/translations';
import { Language, LanguageMeta } from '../../types';
import {
  Globe,
  Search,
  Check,
  X,
  Mic,
  Keyboard,
  Sparkles
} from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useFairShift();
  const t = getTranslation(language);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'indian' | 'international'>('all');

  const totalCount = SUPPORTED_LANGUAGES.length;
  const indianCount = SUPPORTED_LANGUAGES.filter(l => l.category === 'indian').length;
  const intlCount = SUPPORTED_LANGUAGES.filter(l => l.category === 'international').length;

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeTab === 'all'
        ? true
        : activeTab === 'indian'
        ? lang.category === 'indian'
        : lang.category === 'international';

    return matchesSearch && matchesCategory;
  });

  const handleSelect = (code: Language) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Select Interface Language / மொழியைத் தேர்ந்தெடுங்கள்
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {totalCount} Total Languages: {indianCount} Indian Regional Languages + {intlCount} Global Languages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Tabs */}
        <div className="pt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search language / மொழியைத் தேடு... (e.g. Hindi, தமிழ், Urdu, Español)"
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Languages ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('indian')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'indian'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇮🇳 Indian ({indianCount})
            </button>
            <button
              onClick={() => setActiveTab('international')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeTab === 'international'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🌍 International ({intlCount})
            </button>
          </div>
        </div>

        {/* Languages Grid */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-1.5">
          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching languages found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLanguages.map(item => {
                const isSelected = language === item.code;
                return (
                  <button
                    key={item.code}
                    onClick={() => handleSelect(item.code)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">{item.nativeName}</span>
                        {item.isRtl && (
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.name} • <span className="font-mono text-[10px]">{item.script}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.voiceSupported ? (
                        <span
                          title="Voice dictation supported in this language"
                          className="flex items-center gap-1 text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold"
                        >
                          <Mic className="w-3 h-3" /> Voice
                        </span>
                      ) : (
                        <span
                          title="Text interface localization"
                          className="flex items-center gap-1 text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold"
                        >
                          <Keyboard className="w-3 h-3" /> Text
                        </span>
                      )}

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>State preserved across all languages.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
