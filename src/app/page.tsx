"use client";

import React from 'react';
import Link from 'next/link';
import Header from '@/components/navbar';
import Footer from '@/components/footer';
import { Sparkles, Clock, Users, Shield, BookOpen, Zap, Star, ArrowRight, Check, Search } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, gradient = false }) => (
  <div className={`card group hover:scale-105 transition-all duration-300 ${
    gradient ? 'card-featured' : ''
  }`}>
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description, icon: Icon }) => (
  <div className="relative">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <Icon className="w-5 h-5 text-[#e8967a]" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefcfb] via-[#f9f5f3] to-[#f7e6e0] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#e8967a]/10 to-[#d4917e]/10 dark:from-[#e8967a]/5 dark:to-[#d4917e]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-16 pb-20">
            <div className="animate-fade-in-up">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-2xl shadow-2xl flex items-center justify-center animate-float">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-[#e8967a] to-[#d4917e] rounded-2xl opacity-20 blur-lg"></div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#e8967a] to-[#d4917e] bg-clip-text text-transparent">
                  SmartChef
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Votre chef IA
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transformez vos ingrédients en délicieuses recettes personnalisées grâce à l'intelligence artificielle. 
                <span className="text-[#e8967a] font-semibold"> Simple, rapide et savoureux.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/register"
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 shadow-2xl"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Commencer gratuitement</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/recipes"
                  className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Découvrir les recettes</span>
                </Link>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Gratuit à vie</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Recettes illimitées</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>IA avancée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi choisir <span className="text-[#e8967a]">SmartChef</span> ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Une expérience culinaire révolutionnaire qui s'adapte à vos besoins, vos goûts et vos contraintes alimentaires.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={Sparkles}
              title="IA Créative"
              description="Notre intelligence artificielle génère des recettes uniques et savoureuses à partir de vos ingrédients disponibles."
              gradient={true}
            />
            <FeatureCard
              icon={Shield}
              title="Allergies & Intolérances"
              description="Configurez vos allergies et intolérances alimentaires pour des recettes 100% adaptées à vos besoins."
            />
            <FeatureCard
              icon={Clock}
              title="Temps de Cuisson"
              description="Obtenez des informations précises sur les temps de préparation et de cuisson pour planifier vos repas."
            />
            <FeatureCard
              icon={Users}
              title="Portions Personnalisées"
              description="Ajustez automatiquement les quantités selon le nombre de personnes à nourrir."
            />
            <FeatureCard
              icon={BookOpen}
              title="Étapes Détaillées"
              description="Suivez des instructions claires et détaillées pour réussir vos plats à coup sûr."
            />
            <FeatureCard
              icon={Star}
              title="Valeurs Nutritionnelles"
              description="Accédez aux informations nutritionnelles complètes de chaque recette générée."
            />
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça <span className="text-[#e8967a]">fonctionne</span> ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              En seulement quelques étapes, transformez vos ingrédients en chef-d'œuvre culinaire.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              number="1"
              icon={Search}
              title="Ajoutez vos ingrédients"
              description="Listez simplement les ingrédients que vous avez sous la main."
            />
            <StepCard
              number="2"
              icon={Sparkles}
              title="L'IA génère"
              description="Notre intelligence artificielle crée une recette personnalisée instantanément."
            />
            <StepCard
              number="3"
              icon={BookOpen}
              title="Cuisinez facilement"
              description="Suivez les étapes détaillées avec temps de cuisson et conseils."
            />
            <StepCard
              number="4"
              icon={Star}
              title="Sauvegardez & Partagez"
              description="Gardez vos recettes favorites et partagez-les avec la communauté."
            />
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-[#e8967a] to-[#d4917e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à révolutionner votre cuisine ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui ont déjà découvert le plaisir de cuisiner avec SmartChef.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#e8967a] px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Créer mon compte gratuit</span>
              </Link>
              <Link
                href="/recipes"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#e8967a] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explorer les recettes</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}