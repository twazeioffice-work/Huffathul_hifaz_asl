import React from 'react';

export default function CommunicationGateway() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-screen flex flex-col">
      <header className="mb-6 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800">Omnichannel Gateway</h1>
        <p className="text-slate-500 mt-2">Manage WhatsApp, AI Helpdesk, and SMS Broadcasts</p>
      </header>
      
      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
        {/* Left Column: Contact List */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 bg-slate-50">Active Conversations</div>
          <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
            <h3 className="font-medium text-slate-800">+1 234 567 890 (Parent)</h3>
            <p className="text-sm text-slate-500 truncate">What are the fees for next semester?</p>
          </div>
          <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer bg-blue-50">
            <h3 className="font-medium text-blue-800">AI Helpdesk Bot</h3>
            <p className="text-sm text-blue-600 truncate">Resolving query automatically...</p>
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="max-w-md bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-slate-700 border border-slate-100">
              Assalamoalaikum, my child was absent yesterday due to sickness.
            </div>
            <div className="max-w-md ml-auto bg-emerald-600 p-4 rounded-2xl rounded-tr-none shadow-sm text-white">
              Walaikum Assalam. The AI has noted the sick leave in the LMS database. JazakAllah!
            </div>
          </div>
          <div className="p-4 bg-white border-t border-slate-200 flex gap-4">
            <input 
              type="text" 
              placeholder="Type a manual override message..." 
              className="flex-1 px-4 py-2 bg-slate-100 rounded-full outline-none focus:ring-2 ring-emerald-500/20"
            />
            <button className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
