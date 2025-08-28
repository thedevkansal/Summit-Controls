import React from 'react';
import { CheckCircle, Building2, User, Phone, BedDouble, Ticket, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DetailRow = ({ icon, label, value }) => (
    <div>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
            {icon}
            {label}
        </p>
        <p className="text-lg font-medium text-slate-200">{value || 'N/A'}</p>
    </div>
);


const ParticipantCard = ({ participant }) => {
    // Check the status from the API data
    const isPrinted = participant.checkInStatus === 'Printed';

    return (
        <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, type: 'spring' }}
        >
            <div className="w-full rounded-xl bg-slate-900 p-6 text-white shadow-2xl ring-1 ring-slate-700">
                <div className="flex items-start justify-between border-b border-slate-700 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold">{participant.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-slate-400">
                            <Building2 className="h-4 w-4" />
                            <p>{participant.college}</p>
                        </div>
                    </div>
                    {/* --- THE FIX: This block displays the status badge --- */}
                    <div 
                        className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            isPrinted 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'bg-green-500/10 text-green-400'
                        }`}
                    >
                        {isPrinted ? <HelpCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        <span>{participant.checkInStatus}</span>
                    </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                    <DetailRow icon={<User className="h-3 w-3" />} label="Gender" value={participant.gender} />
                    <DetailRow icon={<Phone className="h-3 w-3" />} label="Contact" value={participant.contact} />
                    <DetailRow icon={<BedDouble className="h-3 w-3" />} label="Accommodation" value={participant.accommodation} />
                    <DetailRow icon={<Ticket className="h-3 w-3" />} label="Pass Type" value={participant.passType} />
                </div>
            </div>
        </motion.div>
    );
};

export default ParticipantCard;
