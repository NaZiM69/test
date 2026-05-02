import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Filter,
  Download,
  UserPlus,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  Calendar,
  Mail,
  Shield,
  AlertTriangle,
  CreditCard,
  Clock,
  MoreVertical,
  ChevronDown,
  X,
} from "lucide-react";
import { api } from "../../services/api";
import type { User, SubscriptionPlan } from "../../types";

interface ExtendedUser extends User {
  subscription_id?: number;
  plan_id?: string | number;
  plan_name?: string;
  subscription_date?: string;
  end_date?: string;
  is_active?: boolean;
  is_expired?: boolean;
}

const MemberManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
    role: "CLIENT" as "CLIENT" | "ADMIN",
    plan_id: "",
    start_date: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, plansRes, subsRes] = await Promise.all([
        api.getUsers(),
        api.getPlans(),
        api.getSubscriptions(),
      ]);

      // Merge user data with subscription data for the unified view
      const mergedUsers = usersRes.data
        .filter((user: User) => user.role === "CLIENT")
        .map((user: User) => {
          const sub = subsRes.data.find((s: any) => s.user_id === user.id);
          return {
            ...user,
            subscription_id: sub ? sub.id : null,
            plan_id: sub ? sub.plan : "",
            plan_name: sub ? sub.plan_name : "No Plan",
            subscription_date: sub ? sub.start_date : null,
            end_date: sub ? sub.end_date : null,
            is_active: sub ? sub.is_active : false,
            is_expired: sub ? sub.is_expired : false,
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
    } catch (error: any) {
      console.error("Error creating client:", error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        error.message;
      alert(`Failed to create client: ${errorMsg}`);
    }
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      // Update User Info
      await api.updateUser(editingUser.id, {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role,
      });

      // Update Subscription if plan or date changed
      const originalUser = users.find((u) => u.id === editingUser.id);
      const hasPlanChanged =
        formData.plan_id.toString() !==
        (originalUser?.plan_id || "").toString();
      const hasDateChanged =
        formData.start_date !==
        (originalUser?.subscription_date
          ? originalUser.subscription_date.split("T")[0]
          : "");

      if (hasPlanChanged || hasDateChanged) {
        if (formData.plan_id) {
          // Create new subscription (backend handles deactivating old ones)
          await api.createSubscription({
            user: editingUser.id,
            plan: parseInt(formData.plan_id),
            start_date: formData.start_date,
          });
        } else if (originalUser?.subscription_id && originalUser.is_active) {
          // If changed to "No Plan", deactivate the current one
          await api.toggleSubscriptionStatus(originalUser.subscription_id);
        }
      }

      setIsEditModalOpen(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const handleToggleStatus = async (subId?: number) => {
    if (!subId) return;
    try {
      await api.toggleSubscriptionStatus(subId);
      fetchData();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert(
        "Failed to toggle subscription status. Only active non-expired subscriptions can be toggled.",
      );
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

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.first_name + " " + u.last_name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.plan_name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Members Directory
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-none uppercase">
            <span className="italic font-serif text-orange-500">Members</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl">
            View and manage all member profiles and subscriptions.
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
              placeholder="Search members..."
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
            Add New Member
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Members",
            value: users.length,
            color: "text-orange-500",
            icon: <Users size={20} strokeWidth={1.5} />,
          },
          {
            label: "Active Members",
            value: users.filter((u) => u.is_active && !u.is_expired).length,
            color: "text-orange-400",
            icon: <CheckCircle2 size={20} strokeWidth={1.5} />,
          },
          {
            label: "Expired",
            value: users.filter((u) => u.is_expired).length,
            color: "text-gray-600",
            icon: <XCircle size={20} strokeWidth={1.5} />,
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "ADMIN").length,
            color: "text-orange-600",
            icon: <Shield size={20} strokeWidth={1.5} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-6 group hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-orange-500/[0.01] pointer-events-none"></div>
            <div
              className={`p-4 rounded-2xl bg-black border border-white/10 ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(0,0,0,0.3)]`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-light text-white italic font-serif leading-none tracking-tighter">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Data Grid */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-0 bg-orange-500/[0.01] pointer-events-none"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] border-b border-white/5">
                <th className="px-8 py-8 font-bold">Name</th>
                <th className="px-8 py-8 font-bold">Plan</th>
                <th className="px-8 py-8 font-bold">Duration</th>
                <th className="px-8 py-8 font-bold text-center">Status</th>
                <th className="px-8 py-8 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-32 text-center text-gray-600 italic font-serif text-xl animate-pulse"
                  >
                    Loading members...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-32 text-center text-gray-600 italic font-serif text-xl"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-orange-500/[0.02] transition-colors group"
                  >
                    {/* Profile */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center font-serif italic text-2xl text-orange-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-lg font-light text-white tracking-tight group-hover:italic transition-all duration-300">
                            {user.first_name || user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.username}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1 font-bold uppercase tracking-widest">
                            #{user.id} <span className="opacity-30">•</span>{" "}
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-black border ${user.plan_name === "No Plan" ? "border-white/5" : "border-orange-500/20"}`}
                        >
                          <CreditCard
                            size={14}
                            strokeWidth={1.5}
                            className={
                              user.plan_name === "No Plan"
                                ? "text-gray-800"
                                : "text-orange-500"
                            }
                          />
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${user.plan_name === "No Plan" ? "text-gray-800 italic" : "text-gray-300"}`}
                        >
                          {user.plan_name}
                        </span>
                      </div>
                    </td>

                    {/* Validity Range */}
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                          <Calendar size={12} className="text-orange-500/40" />
                          Start: {formatDate(user.subscription_date)}
                        </div>
                        {user.end_date && (
                          <div className="flex items-center gap-3 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                            <Clock size={12} className="text-orange-600/40" />
                            End: {formatDate(user.end_date)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Indicator */}
                    <td className="px-8 py-6 text-center">
                      {user.plan_name === "No Plan" ? (
                        <span className="text-[9px] text-gray-800 font-black uppercase tracking-[0.3em] border border-white/5 px-3 py-1.5 rounded-full">
                          Inactive
                        </span>
                      ) : user.is_expired ? (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                          <XCircle size={10} /> Expired
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleToggleStatus(user.subscription_id)
                          }
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 active:scale-95 ${
                            user.is_active
                              ? "bg-orange-500/10 text-orange-500 border border-orange-500/30 hover:bg-orange-500 hover:text-white shadow-xl shadow-orange-500/10"
                              : "bg-white/5 text-gray-500 border border-white/10 hover:border-orange-500/30 hover:text-orange-400"
                          }`}
                        >
                          {user.is_active ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          {user.is_active ? "Online" : "Suspended"}
                        </button>
                      )}
                    </td>

                    {/* Action Terminal */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setFormData({
                              ...initialFormState,
                              username: user.username,
                              email: user.email,
                              first_name: user.first_name || "",
                              last_name: user.last_name || "",
                              phone: user.phone || "",
                              role: user.role,
                              plan_id: user.plan_id
                                ? user.plan_id.toString()
                                : "",
                              start_date: user.subscription_date
                                ? user.subscription_date.split("T")[0]
                                : new Date().toISOString().split("T")[0],
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-gray-600 hover:text-white hover:bg-orange-500 hover:border-orange-400 transition-all duration-500 flex items-center justify-center"
                        >
                          <Edit2 size={14} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
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

      {/* Logic Gates (Modals) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
          <div className="bg-black border border-white/10 w-full max-w-3xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.1)] relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-4xl font-light text-white leading-none uppercase">
                  {isEditModalOpen ? "Edit" : "Add"}{" "}
                  <span className="italic font-serif text-orange-500">
                    Member
                  </span>
                </h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">
                  Account and subscription information
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
              className="p-12 space-y-12 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                    Account
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
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
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                    Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            first_name: e.target.value,
                          })
                        }
                        className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_name: e.target.value,
                          })
                        }
                        className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                    />
                    <div className="relative">
                      <select
                        value={formData.role}
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-orange-500 focus:outline-none focus:border-orange-500/50 appearance-none font-bold uppercase tracking-widest opacity-50"
                        disabled
                      >
                        <option value="CLIENT">Member</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                <h3 className="text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em]">
                  Subscription
                </h3>
                <div className="flex gap-6">
                  <div className="w-1/2 relative">
                    <select
                      value={formData.plan_id}
                      onChange={(e) =>
                        setFormData({ ...formData, plan_id: e.target.value })
                      }
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 appearance-none font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <option value="">No Plan</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} — {plan.price} DA
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
                      strokeWidth={3}
                    />
                  </div>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 font-bold uppercase tracking-widest cursor-pointer"
                  />
                </div>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-6 rounded-full bg-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-orange-500/30"
                >
                  {isEditModalOpen ? "Update" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Terminal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-fade-in">
          <div className="bg-black border border-red-500/20 w-full max-w-lg rounded-[4rem] p-16 text-center shadow-[0_0_100px_rgba(239,68,68,0.1)] relative">
            <div className="absolute inset-0 bg-red-500/[0.01] pointer-events-none"></div>
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-10 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-light text-white mb-6 leading-none uppercase italic font-serif">
              Delete <span className="text-red-500">Member</span>
            </h2>
            <p className="text-gray-500 mb-12 text-sm font-light leading-relaxed">
              Delete{" "}
              <span className="text-white font-bold tracking-widest">
                {userToDelete.username.toUpperCase()}
              </span>
              ? All member data will be permanently removed.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="flex-1 py-5 rounded-full bg-white/5 font-bold text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:bg-white/10 hover:text-white transition-all duration-500 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-5 rounded-full bg-red-600 font-bold text-[10px] uppercase tracking-[0.3em] text-white hover:bg-red-500 shadow-2xl shadow-red-600/30 transition-all duration-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagementPage;
