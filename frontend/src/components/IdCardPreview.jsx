import React from 'react';
import { User, Building2, Phone, BedDouble, Ticket } from 'lucide-react';

const IdCardPreview = ({ participant }) => {
  return (
    <div className="id-card-content w-[320px] h-[512px] rounded-2xl bg-slate-900 shadow-2xl p-6 flex flex-col text-white font-sans ring-1 ring-slate-700">
      <div className="text-center border-b-2 border-slate-700 pb-3">
        <h3 className="text-xl font-extrabold text-indigo-400">E-SUMMIT 2024</h3>
        <p className="text-xs font-semibold text-slate-400 tracking-widest">PARTICIPANT ID</p>
      </div>
      
      <div className="flex flex-col items-center text-center my-auto">
        <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center ring-4 ring-indigo-500/50 mb-4">
          <User className="w-16 h-16 text-slate-500" />
        </div>
        <h4 className="text-2xl font-bold leading-tight">{participant.name}</h4>
        <div className="flex items-center gap-2 mt-1 text-slate-400">
            <Building2 className="w-4 h-4" />
            <p className="text-sm">{participant.college}</p>
        </div>
      </div>

      <div className="text-xs space-y-2 border-t border-slate-700 pt-3">
         <div className="flex justify-between"><strong className="font-medium text-slate-400">Contact:</strong> <span className="font-mono">{participant.contact}</span></div>
         <div className="flex justify-between"><strong className="font-medium text-slate-400">Gender:</strong> <span>{participant.gender}</span></div>
         <div className="flex justify-between"><strong className="font-medium text-slate-400">Pass Type:</strong> <span className="font-semibold text-indigo-400">{participant.passType}</span></div>
         <div className="flex justify-between"><strong className="font-medium text-slate-400">Accommodation:</strong> <span>{participant.accommodation}</span></div>
         <p className="text-center text-slate-500 font-mono pt-2">{participant.id}</p>
      </div>
    </div>
  );
};

export default IdCardPreview;
