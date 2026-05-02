import React, { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Search,
  Shield,
  UserPlus,
  Mail,
  Phone,
  Plus,
  AlertTriangle,
  X,
} from "lucide-react";
import { api } from "../../services/api";
import type { User } from "../../types";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const initialFormState = {
    username: "",
    email: "",
    password: "password123",
    first_name: "",
    last_name: "",
    phone: "",
    role: "ADMIN" as const,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      const filteredAdmins = res.data.filter(
        (user: User) => user.role === "ADMIN",
      );
      setAdmins(filteredAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
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
      console.error("Error creating admin:", error);
      alert("Failed to create admin.");
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
        role: "ADMIN",
      });
      setIsEditModalOpen(false);
      setFormData(initialFormState);
      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update admin.");
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
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin.");
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.first_name + " " + a.last_name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Command Authority
          </div>
          <h1 className="italic text-5xl md:text-6xl font-serif text-orange-500 tracking-tight leading-none uppercase">
            Admins{" "}
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl">
            Administrators with full system access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
              size={16}
              strokeWidth={2.5}
            />
            <input
              type="text"
              placeholder="Filter Authorities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 w-72 focus:outline-none focus:border-orange-500/50 focus:bg-orange-500/[0.02] transition-all text-[10px] uppercase tracking-widest font-bold placeholder:text-gray-700"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-orange-500/20 group"
          >
            <UserPlus
              size={18}
              strokeWidth={1.5}
              className="group-hover:scale-110 transition-transform"
            />
            Add new admin
          </button>
        </div>
      </div>

      {/* Authority Grid */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-0 bg-orange-500/[0.01] pointer-events-none"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] border-b border-white/5">
                <th className="px-8 py-8 font-bold">Operator Identity</th>
                <th className="px-8 py-8 font-bold">
                  Communication Connection
                </th>
                <th className="px-8 py-8 font-bold">Clearance Level</th>
                <th className="px-8 py-8 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-32 text-center text-gray-600 italic font-serif text-xl animate-pulse"
                  >
                    Syncing operator registry...
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-32 text-center text-gray-600 italic font-serif text-xl"
                  >
                    No administrative members detected.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-orange-500/[0.02] transition-colors group"
                  >
                    {/* Profile */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-serif italic text-2xl text-orange-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                          {admin.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-lg font-light text-white tracking-tight group-hover:italic transition-all duration-300">
                            {admin.first_name || admin.last_name
                              ? `${admin.first_name} ${admin.last_name}`
                              : admin.username}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1 font-bold uppercase tracking-widest">
                            @{admin.username}{" "}
                            <span className="opacity-30">•</span> Member{" "}
                            {admin.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <Mail size={12} className="text-orange-500/40" />
                          {admin.email}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <Phone size={12} className="text-orange-500/40" />
                          {admin.phone || "NO LINK"}
                        </div>
                      </div>
                    </td>

                    {/* Clearance */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Shield
                          size={14}
                          className="text-orange-500"
                          strokeWidth={1.5}
                        />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500/80">
                          Level 5 / Root
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => {
                            setEditingAdmin(admin);
                            setFormData({
                              username: admin.username,
                              email: admin.email,
                              password: "",
                              first_name: admin.first_name || "",
                              last_name: admin.last_name || "",
                              phone: admin.phone || "",
                              role: "ADMIN",
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-gray-600 hover:text-white hover:bg-orange-500 hover:border-orange-400 transition-all duration-500 flex items-center justify-center"
                        >
                          <Edit2 size={14} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => {
                            setAdminToDelete(admin);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-10 h-10 bg-red-500/0 border border-red-500/0 rounded-xl text-gray-800 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-500 flex items-center justify-center"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authority Logic (Modals) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
          <div className="bg-black border border-white/10 w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.1)] relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-4xl font-light text-white leading-none uppercase">
                  {isEditModalOpen ? "Update" : "Authorize"}{" "}
                  <span className="italic font-serif text-orange-500">
                    Member
                  </span>
                </h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">
                  Administrative credentials and connection plans
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditModalOpen(false);
                  setFormData(initialFormState);
                }}
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-700 hover:text-white transition-all duration-500 hover:rotate-90 border border-white/10"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <form
              onSubmit={isEditModalOpen ? handleUpdate : handleSubmit}
              className="p-12 space-y-10 relative z-10"
            >
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="IDENTITY TAG"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                />
                {!isEditModalOpen && (
                  <input
                    type="password"
                    placeholder="SYNCHRONIZATION KEY"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                  />
                )}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="FIRST"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                  />
                  <input
                    type="text"
                    placeholder="LAST"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                  />
                </div>
                <input
                  type="text"
                  placeholder="PHONE NUMBER"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    setFormData(initialFormState);
                  }}
                  className="flex-1 py-6 rounded-full bg-white/5 font-bold text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:text-white hover:bg-white/10 transition-all duration-500 border border-white/10"
                >
                  Abort Mission
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-6 rounded-full bg-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-orange-500/30"
                >
                  {isEditModalOpen ? "Execute Updates" : "Authorize Authority"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revocation Terminal */}
      {isDeleteModalOpen && adminToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-fade-in">
          <div className="bg-black border border-red-500/20 w-full max-w-lg rounded-[4rem] p-16 text-center shadow-[0_0_100px_rgba(239,68,68,0.1)] relative">
            <div className="absolute inset-0 bg-red-500/[0.01] pointer-events-none"></div>
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-10 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-light text-white mb-6 leading-none uppercase italic font-serif">
              Authority <span className="text-red-500">Purge</span>
            </h2>
            <p className="text-gray-500 mb-12 text-sm font-light leading-relaxed">
              Initiating total revocation of administrative clearance for{" "}
              <span className="text-white font-bold tracking-widest">
                {adminToDelete.username.toUpperCase()}
              </span>
              . All root access will be permanently severed.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAdminToDelete(null);
                }}
                className="flex-1 py-5 rounded-full bg-white/5 font-bold text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:bg-white/10 hover:text-white transition-all duration-500 border border-white/10"
              >
                Abort Revocation
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-5 rounded-full bg-red-600 font-bold text-[10px] uppercase tracking-[0.3em] text-white hover:bg-red-500 shadow-2xl shadow-red-600/30 transition-all duration-500"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;
