"use client";

import React, { useState } from "react";
import { UploadCloud, Download, FileText, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function ImportWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [importType, setImportType] = useState("Students");

  const steps = [
    "Select Data Type",
    "Download Template",
    "Upload CSV",
    "Preview & Validate",
    "Confirm Import"
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-black font-semibold p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center space-x-2">
            <UploadCloud className="h-6 w-6 text-blue-400" />
            <span>Data Import Wizard</span>
          </h1>
          <p className="text-sm text-slate-700 font-medium mt-1">Bulk import records via CSV into the ecosystem securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Stepper */}
        <div className="md:col-span-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 backdrop-blur-xl space-y-1">
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            return (
              <div 
                key={stepNum} 
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  isCurrent ? "bg-blue-500/10 border border-blue-500/20" : "border border-transparent"
                }`}
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isCompleted ? "bg-blue-500 text-white" : isCurrent ? "bg-blue-500/30 text-blue-300 border border-blue-500/50" : "bg-slate-800 text-slate-700 font-medium"
                }`}>
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                <span className={`text-sm ${isCurrent ? "text-blue-300 font-bold" : isCompleted ? "text-slate-800 font-medium" : "text-slate-700 font-medium"}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 backdrop-blur-xl flex flex-col justify-between min-h-[500px]">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">{steps[currentStep - 1]}</h2>
            
            {currentStep === 1 && (
              <div className="mt-8 space-y-4">
                <p className="text-slate-700 font-medium text-sm mb-4">Select the type of data you wish to import.</p>
                {["Students", "Staff", "Parents", "Opening Balances", "Previous Sabaq Records"].map(type => (
                  <label key={type} className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-colors ${importType === type ? 'bg-blue-500/10 border-blue-500/50' : 'bg-black/5 border-slate-200 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="importType" 
                      value={type}
                      checked={importType === type}
                      onChange={(e) => setImportType(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-600"
                    />
                    <span className="text-slate-200 font-medium">{type}</span>
                  </label>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="mt-8 flex flex-col items-center justify-center p-12 bg-black/5 border border-slate-200 border-dashed rounded-2xl space-y-4">
                <FileText className="h-16 w-16 text-blue-400/50" />
                <p className="text-slate-800 font-medium text-center max-w-sm">Download the standardized CSV template for <strong>{importType}</strong> to ensure your data maps correctly.</p>
                <button className="mt-4 flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download {importType}.csv</span>
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="mt-8 flex flex-col items-center justify-center p-12 bg-black/5 border border-slate-200 border-dashed rounded-2xl space-y-4 cursor-pointer hover:bg-black/30 hover:border-slate-300 transition-all">
                <UploadCloud className="h-16 w-16 text-slate-700 font-medium" />
                <div className="text-center">
                  <p className="text-slate-800 font-medium font-medium">Drag and drop your filled CSV file here</p>
                  <p className="text-slate-700 font-medium text-sm mt-1">or click to browse from your computer</p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-400">Validation Warnings Found</h4>
                    <p className="text-xs text-amber-500/70 mt-1">3 rows contain potential duplicate records. 1 row has a missing mandatory field.</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-sm text-slate-700 font-medium">
                    <thead className="bg-black/5 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">Row</th>
                        <th className="px-4 py-3">Field</th>
                        <th className="px-4 py-3">Error/Warning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/5">
                      <tr>
                        <td className="px-4 py-3 font-mono">#42</td>
                        <td className="px-4 py-3 font-medium text-slate-800 font-medium">Phone Number</td>
                        <td className="px-4 py-3 text-amber-400">Duplicate phone number found in system.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono">#89</td>
                        <td className="px-4 py-3 font-medium text-slate-800 font-medium">Date of Birth</td>
                        <td className="px-4 py-3 text-rose-400">Invalid date format (Required: YYYY-MM-DD).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="mt-8 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Ready to Import</h3>
                  <p className="text-slate-700 font-medium text-sm mt-2 max-w-md">
                    You are about to securely inject 142 valid {importType} records into the ecosystem. This action will trigger background indexing.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
            <button 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 font-medium hover:text-slate-200 hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            <button 
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentStep === 4 ? "Accept & Continue" : currentStep === 5 ? "Begin Import" : "Continue"}</span>
              {currentStep !== 5 && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
