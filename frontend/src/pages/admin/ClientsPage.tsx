import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Filter,
  Download,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Calendar,
  Mail,
  Shield,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { api } from "../../services/api";
import type { User, SubscriptionPlan } from "../../types";

interface ExtendedUser extends User {
  plan_name?: string;
  subscription_date?: string;
}

const ClientsPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form State
  const initialFormState = {
    username: "",
    email: "",
    password: "password123",
    first_name: "",
    last_name: "",
    phone: "",
    role: "CLIENT" as "CLIENT" | "ADMIN",
    plan_id: "",
    start_date: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, plansRes, subsRes] = await Promise.all([
        api.getUsers(),
        api.getPlans(),
        api.getSubscriptions(),
      ]);

      // Merge user data with subscription data
      const mergedUsers = usersRes.data.map((user: User) => {
        const sub = subsRes.data.find((s: any) => s.user_id === user.id);
        return {
          ...user,
          plan_name: sub ? sub.plan_name : "No Plan",
          subscription_date: sub ? sub.start_date : null,
        };
      });

      setUsers(mergedUsers);
      setPlans(plansRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create User
      const userRes = await api.createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role,
      });

      const newUserId = userRes.data.id;
      console.log("New User Created with ID:", newUserId);

      // 2. Assign Subscription if plan selected
      if (formData.plan_id && newUserId) {
        await api.createSubscription({
          user: newUserId,
          plan: parseInt(formData.plan_id),
          start_date: formData.start_date,
        });
      }

      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error) {
      console.error("Error creating client:", error);
      alert(
        "Failed to create client. Please check if username/email already exists.",
      );
    }
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      ...initialFormState,
      username: user.username,
      email: user.email,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await api.updateUser(editingUser.id, {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role,
      });
      setIsEditModalOpen(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Client Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your members and their active subscriptions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          <UserPlus size={18} />
          Add New Client
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Members",
            value: users.length,
            color: "text-orange-500",
            icon: <UserPlus size={20} />,
          },
          {
            label: "Active Subscriptions",
            value: users.filter(
              (u) => u.role === "CLIENT" && u.plan_name !== "No Plan",
            ).length,
            color: "text-green-500",
            icon: <CheckCircle2 size={20} />,
          },
          {
            label: "Staff Members",
            value: users.filter((u) => u.role === "ADMIN").length,
            color: "text-purple-500",
            icon: <Shield size={20} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Data Grid */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type / Plan</th>
                <th className="px-6 py-4">Sub. Date</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-600/10 text-orange-500 flex items-center justify-center font-bold text-sm border border-orange-500/20">
                          {user.first_name
                            ? user.first_name.charAt(0).toUpperCase()
                            : user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.first_name || user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.username}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            ID: #USR-{user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard
                          size={14}
                          className={
                            user.plan_name === "No Plan"
                              ? "text-gray-600"
                              : "text-purple-500"
                          }
                        />
                        <span
                          className={`text-sm ${user.plan_name === "No Plan" ? "text-gray-600 italic" : "text-gray-300 font-medium"}`}
                        >
                          {user.plan_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} className="text-orange-500/50" />
                        {formatDate(user.subscription_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-orange-600/20 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(user)}
                          className="p-2 bg-red-500/5 rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={16} />
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

      {/* Add/Edit Modal */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h2 className="text-xl font-bold">
                {isEditModalOpen
                  ? "Edit Client Profile"
                  : "Register New Client"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditModalOpen(false);
                  setFormData(initialFormState);
                }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Plus className="rotate-45" size={28} />
              </button>
            </div>

            <form
              onSubmit={isEditModalOpen ? handleUpdate : handleSubmit}
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">
                  Account Info
                </h3>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                {!isEditModalOpen && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">
                  Personal Info
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+213..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
                    }
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 appearance-none"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {!isEditModalOpen && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Select Plan
                      </label>
                      <select
                        value={formData.plan_id}
                        onChange={(e) =>
                          setFormData({ ...formData, plan_id: e.target.value })
                        }
                        className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 appearance-none"
                      >
                        <option value="">No Plan</option>
                        {plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} - {plan.price} DA
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            start_date: e.target.value,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="md:col-span-2 flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    setFormData(initialFormState);
                  }}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl bg-orange-600 font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20"
                >
                  {isEditModalOpen ? "Save Changes" : "Confirm Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-red-500/20 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-red-500/10">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Delete Client?
              </h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="text-white font-bold">
                  {userToDelete.username}
                </span>
                ? This action is permanent and will remove all associated
                records.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-4 rounded-xl bg-red-600 font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-500/20"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
