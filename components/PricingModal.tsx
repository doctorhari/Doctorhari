import React from 'react';
import { X, Check, Star, Shield, Zap } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-indigo-900 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <div className="bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-block mb-3">
              Premium Member
            </div>
            <h2 className="text-3xl font-bold mb-2">Unlock MedRank Pro</h2>
            <p className="text-indigo-200">Supercharge your NEET PG preparation</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Monthly Plan */}
            <div className="flex-1 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors cursor-pointer opacity-70 hover:opacity-100">
              <div className="text-sm font-semibold text-gray-500 mb-1">Monthly</div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-900">₹99</span>
                <span className="text-gray-500 text-sm mb-1">/mo</span>
              </div>
            </div>

            {/* Yearly Plan (Selected) */}
            <div className="flex-1 border-2 border-indigo-600 bg-indigo-50 rounded-xl p-4 relative cursor-pointer shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Best Value
              </div>
              <div className="text-sm font-semibold text-indigo-700 mb-1">Yearly</div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold text-gray-900">₹499</span>
                <span className="text-gray-500 text-sm mb-1">/yr</span>
              </div>
              <div className="text-xs text-green-600 font-medium mt-1">
                Save 58% vs Monthly
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                <Zap size={16} />
              </div>
              <span className="text-gray-700 text-sm">Unlimited AI Performance Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                <Star size={16} />
              </div>
              <span className="text-gray-700 text-sm">Trend Analysis & Rank Predictions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                <Shield size={16} />
              </div>
              <span className="text-gray-700 text-sm">Cloud Backup & Excel Exports</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2">
            Subscribe via UPI / Card
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Secure payment powered by Razorpay/Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
