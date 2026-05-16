'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Camera, Upload, CheckCircle2, AlertCircle, RefreshCcw, User, Bot, Thermometer, Clock, Activity } from 'lucide-react';
import { predictAPI } from '@/lib/api';

const SYMPTOM_OPTIONS = [
  "Not Eating", "Fever", "Weakness", "Lazy / Not Active", "Vomiting", 
  "Coughing", "Weight Loss", "Reduced Milk Production", "Breathing Problem", 
  "Skin Infection", "Eye Infection", "Swelling", "Diarrhea", "None"
];

const ANIMAL_TYPES = ["cow", "dog", "cat", "goat", "buffalo", "horse", "sheep", "pig"];

interface Message {
  role: 'bot' | 'user';
  text: string;
  type?: 'text' | 'symptoms' | 'upload' | 'confirmation' | 'toggle' | 'input' | 'animal_select';
  options?: string[];
  field?: string;
  isTranslated?: boolean;
}

interface SymptomChatProps {
  onComplete: (data: any) => void;
}

export default function SymptomChat({ onComplete }: SymptomChatProps) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: t('predict.chat.welcome'), type: 'upload' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('UPLOAD'); // UPLOAD, ANIMAL_CONFIRM, SYMPTOMS, QUESTIONS, FINALIZING
  const [detectedAnimal, setDetectedAnimal] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    Symptom_1: 'None',
    Symptom_2: 'None',
    Symptom_3: 'None',
    Symptom_4: 'None',
    Duration: '',
    Appetite_Loss: 'No',
    Vomiting: 'No',
    Diarrhea: 'No',
    Coughing: 'No',
    Labored_Breathing: 'No',
    Lameness: 'No',
    Skin_Lesions: 'No',
    Nasal_Discharge: 'No',
    Eye_Discharge: 'No',
    Body_Temperature: ''
  });
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Re-translate first message if language changes before upload
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'bot' && currentStep === 'UPLOAD') {
      setMessages([{ role: 'bot', text: t('predict.chat.welcome'), type: 'upload' }]);
    }
  }, [i18n.language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    addMessage({ role: 'user', text: t('common.loading'), type: 'text' });
    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('lang', i18n.language);
      
      const response = await predictAPI.predictAnimal(uploadData);
      const result = response.data;
      
      if (result.error) throw new Error(result.error);

      // Map detected animal to lower case key for translation
      const animalKey = result.animal.toLowerCase();
      setDetectedAnimal(animalKey);
      
      if (result.needs_confirmation) {
        addMessage({ 
          role: 'bot', 
          text: t('predict.chat.confirmAnimal', { animal: t(`predict.animalTypes.${animalKey}`) }), 
          type: 'confirmation' 
        });
        setCurrentStep('ANIMAL_CONFIRM');
      } else {
        addMessage({ 
          role: 'bot', 
          text: t('predict.chat.detected', { animal: t(`predict.animalTypes.${animalKey}`) }), 
          type: 'symptoms' 
        });
        setFormData(prev => ({ ...prev, Animal_Type: animalKey }));
        setCurrentStep('SYMPTOMS');
      }
    } catch (err) {
      addMessage({ role: 'bot', text: t('predict.chat.manualSelect'), type: 'animal_select' });
      setCurrentStep('ANIMAL_CONFIRM');
    } finally {
      setLoading(false);
    }
  };

  const handleAnimalConfirm = (confirmed: boolean, animalKey?: string) => {
    const finalAnimalKey = confirmed ? detectedAnimal : animalKey;
    addMessage({ role: 'user', text: t(`predict.animalTypes.${finalAnimalKey}`) });
    setFormData(prev => ({ ...prev, Animal_Type: finalAnimalKey }));
    
    setTimeout(() => {
      addMessage({ 
        role: 'bot', 
        text: t('predict.chat.selectSymptoms'), 
        type: 'symptoms' 
      });
      setCurrentStep('SYMPTOMS');
    }, 600);
  };

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    } else if (selectedSymptoms.length < 4) {
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };

  const submitSymptoms = () => {
    const userText = selectedSymptoms.map(s => t(`predict.symptomsList.${s}`)).join(', ');
    addMessage({ role: 'user', text: userText || t('predict.symptomsList.None') });
    
    const updatedForm = { ...formData };
    selectedSymptoms.forEach((s, i) => {
      updatedForm[`Symptom_${i + 1}`] = s;
    });
    setFormData(updatedForm);

    setTimeout(() => {
      startQuestions();
    }, 600);
  };

  const QUESTIONS = [
    { field: 'Duration', textKey: 'predict.questions.Duration', type: 'input', placeholderKey: 'predict.placeholders.days' },
    { field: 'Body_Temperature', textKey: 'predict.questions.Body_Temperature', type: 'input', placeholderKey: 'predict.placeholders.temp' },
    { field: 'Appetite_Loss', textKey: 'predict.questions.Appetite_Loss', type: 'toggle' },
    { field: 'Vomiting', textKey: 'predict.questions.Vomiting', type: 'toggle' },
    { field: 'Diarrhea', textKey: 'predict.questions.Diarrhea', type: 'toggle' },
    { field: 'Coughing', textKey: 'predict.questions.Coughing', type: 'toggle' },
    { field: 'Labored_Breathing', textKey: 'predict.questions.Labored_Breathing', type: 'toggle' },
    { field: 'Lameness', textKey: 'predict.questions.Lameness', type: 'toggle' },
    { field: 'Skin_Lesions', textKey: 'predict.questions.Skin_Lesions', type: 'toggle' },
    { field: 'Nasal_Discharge', textKey: 'predict.questions.Nasal_Discharge', type: 'toggle' },
    { field: 'Eye_Discharge', textKey: 'predict.questions.Eye_Discharge', type: 'toggle' },
  ];

  const startQuestions = () => {
    setCurrentStep('QUESTIONS');
    setQuestionIndex(0);
    askQuestion(0);
  };

  const askQuestion = (index: number) => {
    const q = QUESTIONS[index];
    addMessage({ 
      role: 'bot', 
      text: t(q.textKey), 
      type: q.type as any,
      field: q.field
    });
  };

  const handleAnswer = (value: string) => {
    const field = QUESTIONS[questionIndex].field;
    
    // Translate 'Yes'/'No' for user message
    const displayValue = value === 'Yes' ? t('common.yes') : (value === 'No' ? t('common.no') : value);
    addMessage({ role: 'user', text: displayValue });
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setInputValue('');

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setTimeout(() => {
        askQuestion(questionIndex + 1);
      }, 600);
    } else {
      setTimeout(() => {
        finalizeDiagnosis();
      }, 600);
    }
  };

  const finalizeDiagnosis = async () => {
    setLoading(true);
    addMessage({ role: 'bot', text: t('predict.chat.analyzing') });

    try {
      const payload = {
        ...formData,
        lang: i18n.language
      };

      const response = await predictAPI.predictDisease(payload);
      const result = response.data;
      
      onComplete({
        ...result,
        detected_animal: formData.Animal_Type,
        summary: formData
      });
    } catch (err) {
      addMessage({ role: 'bot', text: t('common.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-b border-green-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{t('predict.assistant')}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">{t('common.online')}</span>
            </div>
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 hover:bg-white rounded-xl transition shadow-sm">
          <RefreshCcw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    msg.role === 'user' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-[1.5rem] shadow-sm relative ${
                    msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none shadow-green-100' 
                    : 'bg-white border border-green-50 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="text-sm md:text-base font-medium leading-relaxed">{msg.text}</p>
                    
                    {/* UI Components inside bubble */}
                    {msg.type === 'upload' && idx === messages.length - 1 && (
                      <div className="mt-4 space-y-3">
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-3xl p-8 hover:bg-green-50 cursor-pointer transition-all hover:border-green-400 group">
                          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                            <Upload className="w-8 h-8 text-green-600" />
                          </div>
                          <span className="text-sm font-black text-green-700">{t('predict.chat.tapUpload')}</span>
                          <span className="text-[10px] text-gray-400 mt-1">{t('predict.chat.uploadConstraints')}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                    )}

                    {msg.type === 'confirmation' && idx === messages.length - 1 && (
                      <div className="mt-4 flex flex-col gap-2">
                        <button 
                          onClick={() => handleAnimalConfirm(true)}
                          className="w-full bg-green-600 text-white py-3 rounded-2xl text-sm font-bold shadow-lg hover:bg-green-700 transition"
                        >
                          {t('predict.chat.yesCorrect')}
                        </button>
                        <div className="flex gap-2">
                          {ANIMAL_TYPES.filter(a => a !== detectedAnimal).slice(0, 3).map(a => (
                            <button 
                              key={a}
                              onClick={() => handleAnimalConfirm(false, a)}
                              className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold hover:border-green-500 hover:text-green-600 transition"
                            >
                              {t('common.no')}, {t(`predict.animalTypes.${a}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.type === 'animal_select' && idx === messages.length - 1 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {ANIMAL_TYPES.map(a => (
                          <button 
                            key={a}
                            onClick={() => handleAnimalConfirm(false, a)}
                            className="bg-green-50 text-green-700 py-2 rounded-xl text-sm font-bold hover:bg-green-600 hover:text-white transition"
                          >
                            {t(`predict.animalTypes.${a}`)}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.type === 'symptoms' && idx === messages.length - 1 && (
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {SYMPTOM_OPTIONS.map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleSymptomToggle(opt)}
                              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                                selectedSymptoms.includes(opt)
                                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {t(`predict.symptomsList.${opt}`)}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={submitSymptoms}
                          className="w-full bg-green-600 text-white py-3 rounded-2xl text-sm font-black shadow-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          {t('predict.chat.confirmContinue')} <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {msg.type === 'toggle' && idx === messages.length - 1 && (
                      <div className="mt-4 flex gap-3">
                        <button 
                          onClick={() => handleAnswer('Yes')}
                          className="flex-1 bg-green-600 text-white py-3 rounded-2xl text-sm font-black shadow-lg"
                        >
                          {t('common.yes')}
                        </button>
                        <button 
                          onClick={() => handleAnswer('No')}
                          className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-2xl text-sm font-black"
                        >
                          {t('common.no')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white border border-green-50 p-4 rounded-3xl shadow-sm flex gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && inputValue.trim() && handleAnswer(inputValue)}
              placeholder={currentStep === 'QUESTIONS' && QUESTIONS[questionIndex].type === 'input' ? t(QUESTIONS[questionIndex].placeholderKey!) : t('predict.chat.placeholder')}
              disabled={currentStep !== 'QUESTIONS' || QUESTIONS[questionIndex].type !== 'input' || loading}
              className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-green-500 outline-none transition disabled:opacity-50 font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {currentStep === 'QUESTIONS' && QUESTIONS[questionIndex].field === 'Body_Temperature' ? <Thermometer className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
          </div>
          <button
            onClick={() => handleAnswer(inputValue)}
            disabled={!inputValue.trim() || loading}
            className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-2xl disabled:opacity-50 transition shadow-xl shadow-green-100 flex items-center justify-center shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      {currentStep === 'QUESTIONS' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
          <motion.div 
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
