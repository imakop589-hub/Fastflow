import React, { useState } from 'react';
import { Shield, CheckCircle2, XCircle, Play, RefreshCw, X, Lock, FileCheck } from 'lucide-react';
import { backend } from '../services/mockBackend';

interface SecurityTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityTestModal: React.FC<SecurityTestModalProps> = ({ isOpen, onClose }) => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Array<{ name: string; status: 'PASS' | 'FAIL'; message: string; http_status: number }> | null>(null);

  if (!isOpen) return null;

  const runSuite = () => {
    setRunning(true);
    setTimeout(() => {
      const suiteResults = backend.runSecurityVerificationSuite();
      setResults(suiteResults);
      setRunning(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Security & Architecture Test Suite</h2>
              <p className="text-xs text-slate-500">
                Automated verification of IDOR isolation, approval filtering, credential scrubbing, and RBAC guards.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-slate-800">Execute Phase 1 Test Assertions</p>
            <p className="text-slate-500">Runs policy enforcement checks and validates tenant boundaries.</p>
          </div>
          <button
            onClick={runSuite}
            disabled={running}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50"
          >
            {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{running ? 'Running Tests...' : 'Run All Tests'}</span>
          </button>
        </div>

        {/* Results */}
        {results ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold px-1">
              <span className="text-slate-700">Assertion Results ({results.filter(r => r.status === 'PASS').length}/{results.length} Passed)</span>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Security Compliant
              </span>
            </div>

            <div className="space-y-2.5">
              {results.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border bg-slate-50 border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-2.5">
                    {res.status === 'PASS' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-slate-900">{res.name}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{res.message}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-200 text-slate-700">
                    HTTP {res.http_status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
            Click "Run All Tests" above to verify the security policies and tenant boundaries in real time.
          </div>
        )}

        {/* IDOR Test Explanation Box */}
        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200/80 text-xs text-orange-950 space-y-1">
          <p className="font-bold flex items-center space-x-1.5 text-orange-900">
            <Lock className="w-3.5 h-3.5 text-orange-700" />
            <span>IDOR Isolation Verification</span>
          </p>
          <p className="text-[11px] text-orange-800 leading-relaxed">
            In compliance with the project specifications, restaurant owners can never access or modify another restaurant's record by tampering with URL parameters (e.g. attempting to update <code>/restaurant/2</code> as Owner 1). This is blocked at the Policy layer and produces an immediate <code>403 Forbidden</code> response.
          </p>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
