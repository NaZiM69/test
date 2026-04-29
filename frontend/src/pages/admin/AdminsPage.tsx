import React, { useState, useEffect } from 'react';
import { 
  Trash2, Edit2, Search, Shield, 
  UserPlus, Mail, Phone, Plus, AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';
import type { User } from '../../types';

const AdminsPage: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<User | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const initialFormState = {
    username: '',
    email: '',
    password: 'password123',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'ADMIN' as const
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      const filteredAdmins = res.data.filter((user: User) => user.role === 'ADMIN');
      setAdmins(filteredAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser(formData);
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchAdmins();
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Failed to create admin.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    try {
      await api.updateUser(editingAdmin.id, {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: 'ADMIN'
      });
      setIsEditModalOpen(false);
      setFormData(initialFormState);
      fetchAdmins();
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin.');
    }
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    try {
      await api.deleteUser(adminToDelete.id);
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin.');
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.first_name + ' ' + a.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Administrator Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage system administrators and staff accounts.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search admins..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 w-64 focus:outline-none focus:border-purple-500/50 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            <UserPlus size={18} />
            Add New Admin
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">Admin Profile</th>
                <th className="px-6 py-5">Contact Info</th>
                <th className="px-6 py-5">Permissions</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-500 animate-pulse">Loading administrator directory...</td></tr>
              ) : filteredAdmins.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-500">No administrators found.</td></tr>
              ) : filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 flex items-center justify-center font-bold text-base border border-purple-500/10">
                        {admin.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {admin.first_name || admin.last_name ? `${admin.first_name} ${admin.last_name}` : admin.username}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-mono">@{admin.username} • ID: {admin.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail size={12} className="text-purple-500/40" />
                        {admin.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone size={12} className="text-purple-500/40" />
                        {admin.phone || 'No phone'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Full Access
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { 
                          setEditingAdmin(admin); 
                          setFormData({
                            username: admin.username,
                            email: admin.email,
                            password: '', // Password not editable here
                            first_name: admin.first_name || '',
                            last_name: admin.last_name || '',
                            phone: admin.phone || '',
                            role: 'ADMIN'
                          }); 
                          setIsEditModalOpen(true); 
                        }} 
                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-purple-600 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => { setAdminToDelete(admin); setIsDeleteModalOpen(true); }} className="p-2 bg-red-500/5 rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{isEditModalOpen ? 'Edit Admin' : 'New Administrator'}</h2>
                <p className="text-gray-500 text-sm mt-1">Grant system management permissions.</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); setFormData(initialFormState); }} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleUpdate : handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Username" required value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all"
                />
                <input 
                  type="email" placeholder="Email Address" required value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all"
                />
                {!isEditModalOpen && (
                  <input 
                    type="password" placeholder="Password" required value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  />
                )}
                <div className="flex gap-4">
                  <input 
                    type="text" placeholder="First Name" value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  />
                  <input 
                    type="text" placeholder="Last Name" value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <input 
                  type="text" placeholder="Phone" value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); setFormData(initialFormState); }}
                  className="flex-1 px-8 py-4 rounded-2xl bg-white/5 font-bold text-gray-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 rounded-2xl bg-purple-600 font-bold text-white hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20"
                >
                  {isEditModalOpen ? 'Update Admin' : 'Confirm Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && adminToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-[#0a0a0a] border border-red-500/20 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-3xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Revoke Admin Access?</h2>
            <p className="text-gray-500 mb-8 text-sm">
              You are about to remove <span className="text-white font-bold">{adminToDelete.username}</span> from the system. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteModalOpen(false); setAdminToDelete(null); }} className="flex-1 py-3.5 rounded-2xl bg-white/5 font-bold text-gray-400 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3.5 rounded-2xl bg-red-600 font-bold text-white shadow-lg shadow-red-600/30">Revoke Access</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;
