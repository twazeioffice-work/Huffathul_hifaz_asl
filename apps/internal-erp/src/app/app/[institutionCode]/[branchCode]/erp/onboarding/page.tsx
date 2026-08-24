"use client";

import React, { useState } from "react";
import { Rocket, CheckCircle2, Circle, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: "Verify branch details" },
    { id: 2, label: "Add Center Admin" },
    { id: 3, label: "Add Nazim" },
    { id: 4, label: "Add Ustads" },
    { id: 5, label: "Create batches" },
    { id: 6, label: "Create halqas" },
    { id: 7, label: "Add students" },
    { id: 8, label: "Set fee structure" },
    { id: 9, label: "Configure WhatsApp number" },
    { id: 10, label: "Test parent message" },
    { id: 11, label: "Create first Sabaq entry" },
    { id: 12, label: "Complete setup" },
  ];

  const progress = Math.round((currentStep / steps.length) * 100);

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-emerald-400" />
            <span>Branch Onboarding Wizard</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Complete these essential steps to activate your branch in the ecosystem.</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-emerald-400">{progress}%</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Completed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Stepper */}
        <div className="md:col-span-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 backdrop-blur-xl space-y-1 h-[600px] overflow-y-auto hide-scrollbar">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            
            return (
              <div 
                key={step.id} 
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  isCurrent ? "bg-emerald-500/10 border border-emerald-500/20" : "border border-transparent"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Circle className="h-5 w-5 text-emerald-400 fill-emerald-400/20 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-600 shrink-0" />
                )}
                <span className={`text-sm ${isCurrent ? "text-emerald-300 font-bold" : isCompleted ? "text-slate-300" : "text-slate-500"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 backdrop-blur-xl flex flex-col justify-between min-h-[600px]">
          <div>
            <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
              Step {currentStep} of {steps.length}
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">{steps[currentStep - 1].label}</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              This step requires you to input specific data required for the system to function. Completing this ensures all downstream modules like finance and reporting work correctly.
            </p>

            {/* Mock Form Area */}
            <div className="bg-black/20 border border-white/5 rounded-xl p-6 flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-slate-500 text-sm">Configuration interface for "{steps[currentStep - 1].label}" goes here.</p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            <button 
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-900/20"
            >
              <span>{currentStep === steps.length ? "Complete Setup" : "Save & Continue"}</span>
              {currentStep !== steps.length && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
