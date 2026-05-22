'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  Download, Save, History, CheckCircle2, 
  AlertTriangle, AlertOctagon, Info, 
  ArrowRight, Share2, ClipboardList, RefreshCcw, Heart, ShieldAlert, Activity, Thermometer,
  MapPin, Phone
} from 'lucide-react';

const VET_DATA = [
  {
    name: "Pet Clinic Pune",
    location: "Kothrud, Pune",
    specialty: "Multi-Specialty Hospital",
    phone: "+91 98765 43210",
    rating: "4.8",
    timing: "24/7"
  },
  {
    name: "Bombay Veterinary College",
    location: "Parel, Mumbai",
    specialty: "Government Research Hospital",
    phone: "+022 2413 1180",
    rating: "4.5",
    timing: "9:00 AM - 6:00 PM"
  },
  {
    name: "Happy Tails Vet",
    location: "Deccan, Pune",
    specialty: "Livestock & Pet Care",
    phone: "+91 88888 77777",
    rating: "4.9",
    timing: "8:00 AM - 10:00 PM"
  },
  {
    name: "Nashik Pet Care Centre",
    location: "College Road, Nashik",
    specialty: "Advanced Surgery & Diagnostics",
    phone: "+91 99999 11111",
    rating: "4.7",
    timing: "24 Hours"
  },
  {
    name: "Aurangabad Animal Hospital",
    location: "Kranti Chowk, Chhatrapati Sambhajinagar",
    specialty: "Emergency Veterinary Care",
    phone: "+91 77777 55555",
    rating: "4.6",
    timing: "9:00 AM - 9:00 PM"
  }
];

interface ResultCardProps {
  prediction: {
    detected_animal?: string;
    animal_confidence?: string;
    disease?: string;
    severity?: string;
    confidence?: string;
    recommendations?: string;
    emergency?: boolean;
    summary?: any;
  };
  onReset: () => void;
}

export default function ResultCard({ prediction, onReset }: ResultCardProps) {
  const { t } = useTranslation();

  const getSeverityStyles = () => {
    if (prediction.emergency) return 'text-red-600 bg-red-50 border-red-200';
    switch (prediction.severity) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getSeverityIcon = () => {
    if (prediction.emergency) return <AlertOctagon className="w-6 h-6" />;
    switch (prediction.severity) {
      case 'High': return <ShieldAlert className="w-6 h-6" />;
      case 'Medium': return <AlertTriangle className="w-6 h-6" />;
      default: return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden max-w-[1100px] w-full mx-auto"
    >
      {/* Top Banner */}
      <div className={`py-5 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b ${getSeverityStyles()}`}>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-3 bg-white rounded-2xl shadow-md shrink-0 flex items-center justify-center">
            {getSeverityIcon()}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">{t('predict.result.title')}</h3>
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
              {prediction.disease === 'Error connecting to AI service' 
                ? t('predict.result.aiServiceError') 
                : prediction.disease 
                  ? t(`predict.diseases.${prediction.disease.toLowerCase()}`, prediction.disease)
                  : t('predict.result.healthAnalysis')}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <span className={`px-5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm border ${getSeverityStyles()}`}>
            {prediction.emergency 
              ? t('predict.result.emergency') 
              : t(`predict.severity.${(prediction.severity || 'Low').toLowerCase()}`, prediction.severity || 'Low') + ' ' + t('predict.result.risk')}
          </span>
          {prediction.emergency && (
            <p className="text-[10px] font-bold text-red-500 animate-pulse">{t('predict.result.contactVet')}</p>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50/40 p-6 rounded-[2rem] border border-green-100/50">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-green-600" />
              <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">{t('predict.result.animal')}</p>
            </div>
            <p className="text-2xl font-black text-gray-900">{prediction.detected_animal ? t(`predict.animalTypes.${prediction.detected_animal.toLowerCase()}`) : '--'}</p>
            <p className="text-[10px] font-bold text-green-600 mt-1">{t('predict.result.confirmedType')}</p>
          </div>

          <div className="bg-purple-50/40 p-6 rounded-[2rem] border border-purple-100/50">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-4 h-4 text-purple-600" />
              <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest">{t('predict.result.temperature')}</p>
            </div>
            <p className="text-2xl font-black text-gray-900">{prediction.summary?.Body_Temperature || '--'}°C</p>
            <p className="text-[10px] font-bold text-purple-600 mt-1">{t('predict.result.clinicalReading')}</p>
          </div>
        </div>

        {/* Symptoms Summary */}
        <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList className="w-5 h-5 text-gray-500" />
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-600">{t('predict.result.symptomSummary')}</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {[1,2,3,4].map(i => {
              const symptom = prediction.summary?.[`Symptom_${i}`];
              if (symptom && symptom !== 'None') {
                return (
                  <span key={i} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-gray-700 shadow-sm border border-gray-100">
                    {t(`predict.symptomsList.${symptom}`)}
                  </span>
                );
              }
              return null;
            })}
            {prediction.summary?.Appetite_Loss === 'Yes' && <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold shadow-sm border border-red-100">{t('predict.questions.Appetite_Loss')}</span>}
            {prediction.summary?.Vomiting === 'Yes' && <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold shadow-sm border border-red-100">{t('predict.questions.Vomiting')}</span>}
            {prediction.summary?.Diarrhea === 'Yes' && <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold shadow-sm border border-red-100">{t('predict.questions.Diarrhea')}</span>}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-green-50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
          <div className="flex items-center gap-3 mb-4 text-green-700">
            <Info className="w-6 h-6" />
            <h4 className="font-black text-sm uppercase tracking-widest">{t('predict.result.recommendations')}</h4>
          </div>
          <p className="text-gray-700 leading-relaxed font-semibold text-lg">
            {prediction.recommendations && prediction.recommendations !== 'Please try again later or consult a veterinarian manually.' 
              ? prediction.recommendations 
              : t('predict.result.recommendationsPlaceholder')}
          </p>
        </div>

        {/* Nearby Doctors Section */}
        <div className="bg-gray-50/40 p-8 rounded-[2.5rem] border border-gray-100/80 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-green-600 animate-bounce" />
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-700">
                {t('dashboard.vets.title')}
              </h4>
            </div>
            <Link 
              href="/vets" 
              className="text-xs font-bold text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              {t('dashboard.vets.viewAll')} &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VET_DATA.slice(0, 2).map((vet) => (
              <div 
                key={vet.name} 
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-black text-gray-900 text-base">{vet.name}</h5>
                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-lg font-bold">
                      ⭐ {vet.rating}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 font-bold mb-4">{vet.specialty}</p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-xs text-gray-600 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{vet.location}</span>
                    </p>
                    <p className="text-xs text-gray-600 font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{vet.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${vet.phone}`}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-3 rounded-xl font-bold text-xs text-center transition-colors"
                  >
                    {t('dashboard.vets.call')}
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(vet.name + ', ' + vet.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-xs text-center transition-colors"
                  >
                    {t('dashboard.vets.directions')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3">
            <Save className="w-5 h-5" /> {t('predict.result.saveToCloud')}
          </button>
          <button 
            onClick={onReset}
            className="bg-white border-2 border-gray-100 hover:border-green-600 text-gray-700 hover:text-green-600 py-5 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3"
          >
            <RefreshCcw className="w-5 h-5" /> {t('predict.result.newTest')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
