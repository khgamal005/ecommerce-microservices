'use client';

import { Button } from '../ui/button';
import {
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  Shield,
  Truck,
  Star,
  Zap,
  Gift,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* Split Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-white via-amber-50 to-orange-50" />
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-[radial-gradient(circle_at_30%_20%,#3b82f6,transparent_50%)]" />
          <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_80%,#f59e0b,transparent_50%)]" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-8">
            {/* Attention Grabbing Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-3 shadow-lg animate-pulse">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">
                🎉 FLASH SALE: Limited Time Offers!
              </span>
            </div>

            {/* Main Headline with Multiple Lines */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-slate-900">Shop Smarter,</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Live Better
                </span>
              </h1>

              {/* Sub Headline */}
              <h2 className="text-2xl md:text-3xl text-slate-700 font-medium">
                Your One-Stop Destination for Everything Amazing
              </h2>
            </div>

            {/* Special Offers List */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                <span className="text-slate-700">
                  <span className="font-bold">Free Gift</span> on orders above
                  $99
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                <span className="text-slate-700">
                  <span className="font-bold">0% EMI</span> & Flexible payment
                  options
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-slate-700">
                  <span className="font-bold">Free Shipping</span> across all
                  orders
                </span>
              </div>
            </div>

            {/* Primary CTA Button with Multiple Encouragements */}
            <div className="space-y-6">
              <div className="relative">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-8 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <ShoppingBag className="mr-3 h-6 w-6" />
                  START SHOPPING NOW
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>

                {/* Floating encouragement */}
                <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                  Click Here! 👆
                </div>
              </div>

              {/* Additional encouragement */}
              <p className="text-center text-slate-600 italic">
                Don't wait!{' '}
                <span className="font-bold text-amber-600">100+ people</span>{' '}
                are shopping right now
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-200">
              {[
                { icon: Shield, text: '100% Secure', color: 'text-green-600' },
                { icon: Star, text: '4.9/5 Rating', color: 'text-amber-500' },
                {
                  icon: CheckCircle,
                  text: 'Easy Returns',
                  color: 'text-blue-600',
                },
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="text-sm font-medium text-slate-700">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative">
            {/* Main Product Showcase Container */}
            <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-blue-100">
              {/* Floating Product 1 */}
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-white rounded-2xl shadow-xl p-4 transform -rotate-12 animate-float">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-200 rounded-xl h-full flex flex-col items-center justify-center p-4">
                  <ShoppingBag className="w-10 h-10 text-blue-600 mb-2" />
                  <span className="text-sm font-bold text-blue-800">
                    Electronics
                  </span>
                  <span className="text-xs text-blue-600">Up to 50% OFF</span>
                </div>
              </div>

              {/* Floating Product 2 */}
              <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-white rounded-2xl shadow-xl p-4 transform rotate-12 animate-float-delayed">
                <div className="bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl h-full flex flex-col items-center justify-center p-4">
                  <Sparkles className="w-10 h-10 text-purple-600 mb-2" />
                  <span className="text-sm font-bold text-purple-800">
                    Fashion
                  </span>
                  <span className="text-xs text-purple-600">Trending Now</span>
                </div>
              </div>

              {/* Main Center Image/Illustration */}
              <div className="relative z-10 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8 h-96 flex flex-col items-center justify-center">
                {/* Animated shopping cart */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-16 h-16 text-white" />
                  </div>
                  {/* Floating shopping items */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl">👕</span>
                  </div>
                </div>

                {/* Animated text */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Your Cart Awaits!
                  </h3>
                  <p className="text-slate-600">Fill it with happiness ✨</p>
                </div>
              </div>
            </div>

            {/* Customer Review Bubble */}
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(-12deg);
          }
          50% {
            transform: translateY(-10px) rotate(-12deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-10px) rotate(12deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out 1.5s infinite;
        }
      `}</style>
    </section>
  );
}
