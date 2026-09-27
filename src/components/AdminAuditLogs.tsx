import React, { useState } from 'react';
import { Activity, Search, ShieldCheck, Filter } from 'lucide-react';
import { backend } from '../services/mockBackend';

export const AdminAuditLogs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const logs = backend.getAuditLogs();

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Security Audit Logs</h1>
          <p className="text-xs text-slate-500">
            Immutable tracking of sensitive operations with IP attribution and automated secret redaction.
          </p>
        </div>

        {/* Module Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'auth', 'restaurants', 'staff', 'settings', 'roles'].map((mod) => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                moduleFilter === mod
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit records by keyword, user, or action..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Actor / User</th>
                <th className="px-5 py-3.5">Action & Module</th>
                <th className="px-5 py-3.5">Operation Description</th>
                <th className="px-5 py-3.5">Sanitized Diff</th>
                <th className="px-5 py-3.5">IP & Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-[11px]">
                    {new Date(log.created_at).toLocaleDateString()}{' '}
                    <span className="text-slate-400 font-mono">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{log.user_name}</p>
                    <p className="text-[10px] text-slate-400">{log.user_email || 'System'}</p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                      {log.module}
                    </span>
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-slate-800">{log.description}</p>
                  </td>

                  <td className="px-5 py-4 max-w-xs font-mono text-[10px]">
                    {log.changes ? (
                      <pre className="bg-slate-50 p-1.5 rounded border border-slate-200 overflow-x-auto text-slate-600">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-[10px] text-slate-400">
                    <p className="font-mono text-slate-600">{log.ip_address}</p>
                    <p className="truncate max-w-[140px] text-slate-400">{log.user_agent}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
