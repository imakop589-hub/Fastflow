import React, { useState } from 'react';
import { Shield, Key, Check, Info, Lock } from 'lucide-react';
import { backend } from '../services/mockBackend';

interface AdminRolesProps {
  onRefresh: () => void;
}

export const AdminRoles: React.FC<AdminRolesProps> = ({ onRefresh }) => {
  const roles = backend.getRoles();
  const permissions = backend.getPermissions();
  const [selectedRoleSlug, setSelectedRoleSlug] = useState<string>('admin');

  const selectedRole = roles.find((r) => r.slug === selectedRoleSlug) || roles[0];

  const handleTogglePermission = (permSlug: string) => {
    try {
      backend.toggleRolePermission(selectedRole.slug, permSlug);
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Role-Based Access Control (RBAC)</h1>
        <p className="text-xs text-slate-500">
          Decoupled roles and granular permissions matrix. Super Admin inherits wildcard (*) permission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            System Roles
          </span>
          {roles.map((role) => {
            const isSelected = role.slug === selectedRoleSlug;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleSlug(role.slug)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs">{role.name}</span>
                    {role.is_system && <Lock className="w-3 h-3 text-slate-400" />}
                  </div>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    {role.slug}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {role.permissions.includes('*') ? 'All (*)' : role.permissions.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Permissions Matrix for Selected Role */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <h2 className="text-base font-bold text-slate-900">{selectedRole.name} Permissions</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
            </div>

            {selectedRole.slug === 'super-admin' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Wildcard System Gate (*)</span>
              </span>
            )}
          </div>

          {/* Grouped Permission Switches */}
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([module, perms]) => (
              <div key={module} className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  {module.replace('_', ' ')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {perms.map((p) => {
                    const isGranted =
                      selectedRole.permissions.includes('*') || selectedRole.permissions.includes(p.slug);
                    const isLocked = selectedRole.slug === 'super-admin';

                    return (
                      <div
                        key={p.id}
                        onClick={() => !isLocked && handleTogglePermission(p.slug)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition select-none ${
                          isGranted
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-slate-50/50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        } ${isLocked ? 'cursor-not-allowed opacity-90' : ''}`}
                      >
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.slug}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isGranted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isGranted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
