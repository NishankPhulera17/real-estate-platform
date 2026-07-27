'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Filter, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck,
  Search,
  MessageSquare
} from 'lucide-react';
import { MOCK_LEADS } from '@/lib/data/mockData';
import { Lead } from '@/lib/types';

export default function AdminCrmDashboard() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0]);
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  
  // New Lead Form State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadBudget, setNewLeadBudget] = useState('₹3 Cr - ₹5 Cr');
  const [newLeadLocation, setNewLeadLocation] = useState('Gurgaon');

  const leadStages: Lead['stage'][] = [
    'New',
    'Contacted',
    'Interested',
    'Qualified',
    'Site Visit Scheduled',
    'Negotiation',
    'Booked',
    'Lost'
  ];

  const updateLeadStage = (leadId: string, newStage: Lead['stage']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadName,
      phone: newLeadPhone,
      email: newLeadEmail,
      budgetRange: newLeadBudget,
      preferredLocation: newLeadLocation,
      source: 'Website',
      timeline: 'Immediate',
      stage: 'New',
      salesperson: 'Ananya Sharma',
      notes: ['Lead added manually via Admin CRM'],
      createdAt: new Date().toISOString(),
      isHighIntent: true
    };
    setLeads([created, ...leads]);
    setSelectedLead(created);
    setShowAddLeadModal(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadEmail('');
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
    l.phone.includes(searchLeadQuery) ||
    l.email.toLowerCase().includes(searchLeadQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-8">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              Admin & Lead CRM Portal
            </span>
            <span className="text-xs text-slate-600">Section 16 CRM Engine</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mt-1">Lead Management & Pipeline</h1>
        </div>

        <button
          onClick={() => setShowAddLeadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-500 text-gray-950 font-bold text-xs shadow-lg hover:bg-brand-400 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Capture New Lead</span>
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-semibold block uppercase">Total Pipeline Leads</span>
            <span className="font-display text-2xl font-bold text-slate-900 mt-0.5 block">{leads.length} Active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-semibold block uppercase">Site Visits Scheduled</span>
            <span className="font-display text-2xl font-bold text-amber-400 mt-0.5 block">
              {leads.filter(l => l.stage === 'Site Visit Scheduled').length} Scheduled
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-semibold block uppercase">High Intent Lead %</span>
            <span className="font-display text-2xl font-bold text-emerald-400 mt-0.5 block">75% High Intent</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-600 font-semibold block uppercase">Forecast Value</span>
            <span className="font-display text-2xl font-bold text-rose-400 mt-0.5 block">₹18.5 Cr</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KANBAN STAGE PIPELINE */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center space-x-2">
          <span>Lead Stages Pipeline</span>
          <span className="text-xs font-normal text-slate-600">(Click a stage badge to update lead progress)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {leadStages.slice(0, 4).map((stage) => {
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} className="glass-panel p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/40">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900">{stage}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-brand-400">{stageLeads.length}</span>
                </div>

                <div className="space-y-2.5 min-h-[160px]">
                  {stageLeads.map(lead => (
                    <div 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedLead?.id === lead.id 
                          ? 'bg-brand-500/10 border-brand-500' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">{lead.name}</h4>
                        {lead.isHighIntent && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold">HOT</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{lead.budgetRange}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lead.preferredLocation}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED LEAD INSPECTION DRAWER / PANEL */}
      {selectedLead && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display text-xl font-bold text-slate-900">{selectedLead.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
                  Source: {selectedLead.source}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Created on {new Date(selectedLead.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Stage Quick Switcher */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-600 font-semibold">Current Stage:</span>
              <select
                value={selectedLead.stage}
                onChange={(e) => updateLeadStage(selectedLead.id, e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-brand-300 font-bold outline-none focus:ring-2 focus:ring-brand-500"
              >
                {leadStages.map(stg => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Phone Number</span>
              <p className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                <span>{selectedLead.phone}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Email Address</span>
              <p className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                <span>{selectedLead.email}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Assigned Advisor</span>
              <p className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{selectedLead.salesperson}</span>
              </p>
            </div>
          </div>

          {/* Notes Log */}
          <div>
            <h4 className="font-display text-sm font-bold text-slate-900 mb-2">Activity Log & Notes</h4>
            <div className="space-y-2">
              {selectedLead.notes.map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MANUALLY ADD LEAD MODAL */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-white border border-slate-300 w-full max-w-md p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-display text-lg font-bold text-slate-900">Manual Lead Entry</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lead Name</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Sameer Khanna"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="+91 98111 22334"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-500 text-gray-950 font-bold text-xs hover:bg-brand-400"
                >
                  Save Lead to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
