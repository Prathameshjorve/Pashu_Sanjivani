'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Stethoscope,
  Languages,
  ShieldCheck,
  Camera,
  FileText,
  HeartPulse,
  Users,
  CheckCircle,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 text-gray-900">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-black text-green-700">
              Pashu Sanjivani
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-bold text-gray-600">
            <a href="#features" className="hover:text-green-700">Features</a>
            <a href="#workflow" className="hover:text-green-700">Workflow</a>
            <a href="#animals" className="hover:text-green-700">Animals</a>
            <a href="#vet" className="hover:text-green-700">Vet Review</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-5 py-2 rounded-xl font-bold text-green-700 hover:bg-green-50">
                Login
              </button>
            </Link>

            <Link href="/signup">
              <button className="px-5 py-2 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-black mb-6">
              <HeartPulse className="w-4 h-4" />
              AI Powered Livestock Healthcare
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8">
              Smarter disease care for
              <span className="text-green-600"> livestock farmers</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
              Pashu Sanjivani helps farmers report symptoms, upload animal images,
              get AI-assisted disease predictions, and receive expert vet review in one platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg flex items-center gap-2">
                  Start Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link href="/login">
                <button className="bg-white border-2 border-green-100 hover:border-green-300 text-green-700 px-8 py-4 rounded-2xl font-black text-lg">
                  Login
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[2rem] shadow-2xl p-8 border border-green-100"
          >
            <div className="mb-6">
              <p className="text-sm font-black text-gray-500 mb-2">
                LIVE CASE SUMMARY
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                Cow Health Report
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-2xl p-5 flex gap-4">
                <Camera className="w-8 h-8 text-green-700" />
                <div>
                  <h3 className="font-black">Image Uploaded</h3>
                  <p className="text-gray-600 text-sm">Animal image ready for AI analysis</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 flex gap-4">
                <Brain className="w-8 h-8 text-blue-700" />
                <div>
                  <h3 className="font-black">AI Prediction</h3>
                  <p className="text-gray-600 text-sm">Disease, confidence, and severity generated</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 flex gap-4">
                <Stethoscope className="w-8 h-8 text-purple-700" />
                <div>
                  <h3 className="font-black">Vet Review</h3>
                  <p className="text-gray-600 text-sm">Expert diagnosis and advice added</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-green-700">3</p>
                <p className="text-xs font-bold text-gray-500">Languages</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-blue-700">AI</p>
                <p className="text-xs font-bold text-gray-500">Prediction</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-purple-700">Vet</p>
                <p className="text-xs font-bold text-gray-500">Review</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black mb-4">Platform Features</h2>
          <p className="text-gray-600 text-lg">
            Everything needed for AI-assisted livestock disease reporting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Camera,
              title: 'Image Detection',
              text: 'Farmers can upload animal images for disease analysis.',
            },
            {
              icon: Brain,
              title: 'AI Prediction',
              text: 'Disease, confidence score, severity, and suggestions.',
            },
            {
              icon: Stethoscope,
              title: 'Vet Dashboard',
              text: 'Vets can review farmer reports and give final advice.',
            },
            {
              icon: Languages,
              title: 'Multilingual UI',
              text: 'Supports farmer-friendly regional language access.',
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="bg-white/70 border-y">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">
              A simple farmer-to-vet disease care workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ['1', 'Report Symptoms', 'Farmer enters animal type, symptoms, and uploads image.'],
              ['2', 'AI Analysis', 'System predicts disease with severity and confidence.'],
              ['3', 'Vet Review', 'Veterinary expert checks the report and adds final advice.'],
              ['4', 'Farmer Guidance', 'Farmer receives diagnosis, advice, medicine, and follow-up status.'],
            ].map(([step, title, text]) => (
              <div key={step} className="bg-white rounded-3xl shadow p-7 relative">
                <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center font-black text-xl mb-5">
                  {step}
                </div>
                <h3 className="text-xl font-black mb-3">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORTED ANIMALS */}
      <section id="animals" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black mb-4">Supported Animals</h2>
          <p className="text-gray-600 text-lg">
            Designed for livestock health monitoring and rural usability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            ['🐄', 'Cattle', 'Disease reporting and AI prediction for cows and cattle.'],
            ['🐐', 'Goats', 'Health support for goat disease symptoms and image cases.'],
            ['🐓', 'Poultry', 'Expandable support for poultry disease reporting.'],
          ].map(([emoji, title, text]) => (
            <div key={title} className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-5">{emoji}</div>
              <h3 className="text-2xl font-black mb-3">{title}</h3>
              <p className="text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VET REVIEW */}
      <section id="vet" className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full font-bold mb-6">
              <ShieldCheck className="w-5 h-5" />
              Vet-in-the-Loop System
            </div>

            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              AI prediction plus expert veterinary validation
            </h2>

            <p className="text-green-50 text-lg leading-relaxed mb-8">
              The system does not only stop at AI prediction. Vets can review reports,
              confirm diagnosis, suggest medicine, and guide farmers with follow-up advice.
            </p>

            <div className="space-y-4">
              {[
                'Separate AI prediction and vet diagnosis',
                'Review status for every farmer report',
                'Medicine and follow-up recommendations',
                'Better trust and practical decision support',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 font-bold">
                  <CheckCircle className="w-6 h-6" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white text-gray-900 rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Vet Review Card</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500 font-bold">AI Prediction</p>
                <p className="text-xl font-black">Lumpy Skin Disease</p>
              </div>

              <div className="bg-red-50 rounded-2xl p-4">
                <p className="text-sm text-red-600 font-bold">Severity</p>
                <p className="text-xl font-black text-red-700">High</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-4">
                <p className="text-sm text-green-600 font-bold">Vet Advice</p>
                <p className="text-gray-700">
                  Isolate the animal, maintain hygiene, and consult a local vet for treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black mb-4">Why It Matters</h2>
          <p className="text-gray-600 text-lg">
            Built for farmers, vets, and livestock health monitoring.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Farmer Friendly',
              text: 'Simple reporting flow helps farmers submit health cases without technical knowledge.',
            },
            {
              name: 'Vet Assisted',
              text: 'Veterinary review improves trust and avoids depending only on AI prediction.',
            },
            {
              name: 'Scalable System',
              text: 'The platform can be extended with real ML models, outbreak maps, and mobile support.',
            },
          ].map((item) => (
            <div key={item.name} className="bg-white rounded-3xl shadow-lg p-8">
              <Users className="w-10 h-10 text-green-700 mb-5" />
              <h3 className="text-xl font-black mb-3">{item.name}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-[2rem] p-10 md:p-14 text-white text-center shadow-2xl">
          <FileText className="w-14 h-14 mx-auto mb-5" />

          <h2 className="text-4xl font-black mb-4">
            Start your livestock health report today
          </h2>

          <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
            Upload symptoms, get AI assistance, and connect the report with veterinary review.
          </p>

          <Link href="/signup">
            <button className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-50">
              Create Account
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-black text-green-700">
              Pashu Sanjivani
            </h3>
            <p className="text-gray-600 mt-1">
              AI-assisted livestock healthcare platform
            </p>
          </div>

          <div className="text-gray-500 text-sm">
            © 2026 Pashu Sanjivani. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}