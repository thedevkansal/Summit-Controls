import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Users, UserCheck, UserX, Search, Loader2, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
// We need to add getStats to our API helper
import { getAllParticipants, getStats } from '../utils/api'; 

const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    className="rounded-xl bg-slate-800/50 p-6 ring-1 ring-slate-700"
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex items-center gap-4">
      <div className={`rounded-lg p-3 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both stats and history in parallel
        const [statsData, historyData] = await Promise.all([
          getStats(),
          getAllParticipants() // This now fetches only checked-in history
        ]);
        setStats(statsData);
        setHistory(historyData);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredHistory = useMemo(() => 
    history.filter(p => {
      const term = searchTerm.toLowerCase();
      const nameMatch = p.name && p.name.toLowerCase().includes(term);
      const collegeMatch = p.college && p.college.toLowerCase().includes(term);
      const checkedInByMatch = p.checkedInBy && p.checkedInBy.toLowerCase().includes(term);
      return nameMatch || collegeMatch || checkedInByMatch;
    }),
    [history, searchTerm]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-lg">Loading Dashboard Data...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="h-8 w-8 text-indigo-400" />
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users size={24} />} label="Total Participants" value={stats.total} color="bg-blue-500/20 text-blue-400" />
        <StatCard icon={<UserCheck size={24} />} label="Checked In" value={stats.checkedIn} color="bg-green-500/20 text-green-400" />
        <StatCard icon={<UserX size={24} />} label="Pending" value={stats.pending} color="bg-yellow-500/20 text-yellow-400" />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold">Check-in History</h2>
        <div className="relative mt-4 mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
                type="text"
                placeholder="Search by name, college, or team member..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full max-w-md rounded-full border-2 border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white transition-colors focus:border-indigo-500 focus:outline-none"
            />
        </div>
        <div className="overflow-hidden rounded-lg bg-slate-800/50 ring-1 ring-slate-700">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Checked-In By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredHistory.map(p => (
                  <tr key={p.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{p.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{p.college || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-indigo-400" />
                            {p.checkedInBy || 'N/A'}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            {p.timestamp || 'N/A'}
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
