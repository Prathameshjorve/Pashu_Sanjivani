'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Download, Save, History, CheckCircle2, 
  AlertTriangle, AlertOctagon, Info, 
  ArrowRight, Share2, ClipboardList, RefreshCcw, Heart, ShieldAlert, Activity, Thermometer
} from 'lucide-react';

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
      className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden max-w-3xl mx-auto"
    >
      {/* Top Banner */}
      <div className={`p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b ${getSeverityStyles()}`}>
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white rounded-3xl shadow-xl shadow-black/5">
            {getSeverityIcon()}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-1">{t('predict.result.title')}</h3>
            <p className="text-3xl font-black tracking-tight">
              {prediction.disease === 'Error connecting to AI service' 
                ? t('predict.result.aiServiceError') 
                : (prediction.disease || t('predict.result.healthAnalysis'))}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-wider shadow-sm border ${getSeverityStyles()}`}>
            {prediction.emergency ? t('predict.result.emergency') : (prediction.severity || 'Low') + ' ' + t('predict.result.risk')}
          </span>
          {prediction.emergency && (
            <p className="text-[10px] font-bold text-red-500 mt-2 animate-pulse">{t('predict.result.contactVet')}</p>
          )}
        </div>
      </div>

      <div className="p-10 space-y-10">
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
