"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  LogOut, Search, Edit2, Trash2, Plus, X, Check,
  ChevronRight, Loader2, RefreshCw, Calendar, Users, Tag, Bell
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReceiptItem {
  description: string
  amount: number
  category: string
  addedAt: string
}

interface Booking {
  id: string
  referenceNumber: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  seatType: string
  allergens: string[]
  dietaryPreference: string
  allergyNotes: string
  appetizers: string[]
  mainCourse: string[]
  desserts: string[]
  nonAlcoholic: string[]
  alcoholic: string[]
  reserveCar: string
  licensePlate: string
  specialRequests: string
  status: string
  isDeleted: boolean
  adminNotes: string
  receiptItems: ReceiptItem[]
  createdAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEAT_LABELS: Record<string, string> = {
  indoor: "Indoor Dining",
  outdoor: "Outdoor Terrace",
  private: "Private Room",
  bar: "Bar Seating",
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "border-green-500/30 bg-green-500/10 text-green-400",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
  pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  completed: "border-primary/30 bg-primary/10 text-primary",
}

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}>
      {status}
    </span>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function BookingPanel({
  booking,
  onClose,
  onUpdate,
  onDelete,
}: {
  booking: Booking
  onClose: () => void
  onUpdate: (updated: Booking) => void
  onDelete: (id: string) => void
}) {
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<Booking>(booking)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [receiptForm, setReceiptForm] = useState({ description: "", amount: "", category: "Charge" })
  const [addingItem, setAddingItem] = useState(false)
  const [panelError, setPanelError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(booking)
    setEditMode(false)
    setPanelError(null)
  }, [booking])

  const handleSave = async () => {
    setSaving(true)
    setPanelError(null)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to update booking.")
      onUpdate(draft)
      setEditMode(false)
    } catch (e) {
      setPanelError(e instanceof Error ? e.message : "Update failed.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to delete booking.")
      onDelete(booking.id)
      onClose()
    } catch (e) {
      setPanelError(e instanceof Error ? e.message : "Delete failed.")
      setDeleting(false)
    }
  }

  const handleAddReceiptItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingItem(true)
    setPanelError(null)
    try {
      const item = {
        description: receiptForm.description,
        amount: parseFloat(receiptForm.amount) || 0,
        category: receiptForm.category,
      }
      const res = await fetch(`/api/admin/bookings/${booking.id}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to add receipt item.")
      const updatedDraft = { ...draft, receiptItems: [...draft.receiptItems, { ...item, addedAt: new Date().toISOString() }] }
      setDraft(updatedDraft)
      onUpdate(updatedDraft)
      setReceiptForm({ description: "", amount: "", category: "Charge" })
    } catch (e) {
      setPanelError(e instanceof Error ? e.message : "Failed to add item.")
    } finally {
      setAddingItem(false)
    }
  }

  const preOrders = [
    ...draft.appetizers, ...draft.mainCourse, ...draft.desserts,
    ...draft.nonAlcoholic, ...draft.alcoholic,
  ]

  const inputCls = "w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
  const labelCls = "text-xs text-muted-foreground mb-1 block"

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl flex flex-col bg-[#0e1625] border-l border-border shadow-2xl overflow-y-auto">
      {/* Panel header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-[#0e1625]">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-primary">{booking.referenceNumber}</p>
          <h2 className="font-serif text-xl font-light text-foreground mt-0.5">{booking.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => { setEditMode(false); setDraft(booking) }}
                className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save
              </button>
            </>
          )}
          <button onClick={onClose} className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-8">
        {panelError && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{panelError}</p>
        )}

        {/* Status */}
        <section>
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">Status</p>
          {editMode ? (
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              className={inputCls}
            >
              {["confirmed", "pending", "completed", "cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <Badge status={draft.status} />
          )}
        </section>

        {/* Guest details */}
        <section>
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">Guest Details</p>
          <div className="grid grid-cols-2 gap-4">
            {editMode ? (
              <>
                <div><label className={labelCls}>Name</label><input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
                <div><label className={labelCls}>Guests</label><input className={inputCls} value={draft.guests} onChange={(e) => setDraft({ ...draft, guests: e.target.value })} /></div>
                <div><label className={labelCls}>Date</label><input type="date" className={inputCls} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></div>
                <div><label className={labelCls}>Time</label><input className={inputCls} value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></div>
              </>
            ) : (
              <>
                {[
                  ["Name", draft.name], ["Email", draft.email],
                  ["Phone", draft.phone || "—"], ["Guests", draft.guests],
                  ["Date", draft.date], ["Time", draft.time],
                  ["Seating", SEAT_LABELS[draft.seatType] ?? draft.seatType],
                  ["Parking", draft.reserveCar === "yes" ? `Yes (${draft.licensePlate || "—"})` : "No"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm text-foreground mt-0.5">{val}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* Allergies */}
        {(draft.allergens.length > 0 || draft.dietaryPreference) && (
          <section>
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">Dietary</p>
            <div className="space-y-2 text-sm">
              {draft.dietaryPreference && (
                <p><span className="text-muted-foreground">Preference: </span><span className="text-foreground">{draft.dietaryPreference}</span></p>
              )}
              {draft.allergens.length > 0 && (
                <p><span className="text-muted-foreground">Allergens: </span><span className="text-foreground">{draft.allergens.join(", ")}</span></p>
              )}
              {draft.allergyNotes && (
                <p><span className="text-muted-foreground">Notes: </span><span className="text-foreground">{draft.allergyNotes}</span></p>
              )}
            </div>
          </section>
        )}

        {/* Pre-orders */}
        {preOrders.length > 0 && (
          <section>
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">Pre-Orders ({preOrders.length})</p>
            <ul className="space-y-1">
              {preOrders.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Special requests */}
        {draft.specialRequests && (
          <section>
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Special Requests</p>
            <p className="text-sm text-foreground leading-relaxed">{draft.specialRequests}</p>
          </section>
        )}

        {/* Admin notes */}
        <section>
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Admin Notes</p>
          {editMode ? (
            <textarea
              value={draft.adminNotes}
              onChange={(e) => setDraft({ ...draft, adminNotes: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Internal notes..."
            />
          ) : (
            <p className="text-sm text-foreground">{draft.adminNotes || <span className="text-muted-foreground italic">No notes</span>}</p>
          )}
        </section>

        {/* Receipt items */}
        <section>
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
            Receipt Items ({draft.receiptItems.length})
          </p>

          {draft.receiptItems.length > 0 && (
            <div className="rounded-lg border border-border divide-y divide-border mb-4">
              {draft.receiptItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">${item.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-primary/5">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-sm font-semibold text-primary">
                  ${draft.receiptItems.reduce((s, i) => s + i.amount, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Add receipt item */}
          <form onSubmit={handleAddReceiptItem} className="rounded-lg border border-border p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  className={inputCls}
                  placeholder="Description"
                  value={receiptForm.description}
                  onChange={(e) => setReceiptForm({ ...receiptForm, description: e.target.value })}
                  required
                />
              </div>
              <input
                className={inputCls}
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount ($)"
                value={receiptForm.amount}
                onChange={(e) => setReceiptForm({ ...receiptForm, amount: e.target.value })}
                required
              />
              <select
                className={inputCls}
                value={receiptForm.category}
                onChange={(e) => setReceiptForm({ ...receiptForm, category: e.target.value })}
              >
                {["Charge", "Food", "Drink", "Service", "Discount", "Other"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={addingItem}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {addingItem ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Add to Receipt
            </button>
          </form>
        </section>

        {/* Delete */}
        <section className="pb-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-foreground mb-1">Danger Zone</p>
            <p className="text-xs text-muted-foreground mb-3">Soft-deletes the booking. It will no longer appear in the active list.</p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Booking
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Are you sure?</p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Booking | null>(null)
  const [adminEmail, setAdminEmail] = useState("")
  const [newAlert, setNewAlert] = useState(0)
  const knownCountRef = useRef(-1)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/bookings", { credentials: "include" })
      if (res.status === 401) { router.replace("/admin/login"); return }
      if (!res.ok) throw new Error("Failed to load bookings.")
      const data: Booking[] = await res.json()
      knownCountRef.current = data.length
      setBookings(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [router])

  const pollBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bookings", { credentials: "include" })
      if (!res.ok) return
      const fresh: Booking[] = await res.json()
      setBookings((prev) => {
        if (knownCountRef.current >= 0 && fresh.length > knownCountRef.current) {
          setNewAlert(fresh.length - knownCountRef.current)
        }
        knownCountRef.current = fresh.length
        return fresh
      })
    } catch {}
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) { router.replace("/admin/login"); return }
    setAdminEmail(localStorage.getItem("admin_email") ?? "")
    fetchBookings()
    const interval = setInterval(pollBookings, 30000)
    return () => clearInterval(interval)
  }, [router, fetchBookings, pollBookings])

  const logout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_email")
    document.cookie = "admin_token=; path=/; max-age=0"
    router.replace("/admin/login")
  }

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase()
    return (
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.referenceNumber.toLowerCase().includes(q) ||
      b.date.includes(q)
    )
  })

  // Stats
  const today = new Date().toISOString().slice(0, 10)
  const stats = {
    total: bookings.length,
    today: bookings.filter((b) => b.createdAt?.startsWith(today)).length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    withParking: bookings.filter((b) => b.reserveCar === "yes").length,
  }

  return (
    <div className="min-h-screen grain-texture bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif text-xl font-medium text-foreground">Maison Glacé</span>
              <span className="hidden sm:block h-4 w-px bg-border" />
              <span className="hidden sm:block text-sm text-muted-foreground">Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-xs text-muted-foreground">{adminEmail}</span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        {/* New booking notification */}
        {newAlert > 0 && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-primary/40 bg-primary/10 px-5 py-3.5 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-primary animate-bounce" />
              <p className="text-sm font-medium text-primary">
                {newAlert} new booking{newAlert > 1 ? "s" : ""} just arrived
              </p>
            </div>
            <button
              onClick={() => setNewAlert(0)}
              className="rounded-md p-1 text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { label: "Total Bookings", value: stats.total, icon: <Tag className="h-4 w-4" /> },
            { label: "Today", value: stats.today, icon: <Calendar className="h-4 w-4" /> },
            { label: "Confirmed", value: stats.confirmed, icon: <Check className="h-4 w-4" /> },
            { label: "With Parking", value: stats.withParking, icon: <Users className="h-4 w-4" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <span className="text-primary opacity-60">{icon}</span>
              </div>
              <p className="font-serif text-3xl font-light text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border gap-4">
            <h2 className="font-serif text-lg font-light text-foreground">Reservations</h2>
            <div className="flex items-center gap-3 flex-1 max-w-sm ml-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bookings…"
                  className="w-full rounded-md border border-border bg-input pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                aria-label="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-6 py-4 text-sm text-destructive border-b border-border">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading bookings…</span>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm">
                {search ? "No bookings match your search." : "No reservations yet."}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground">Guest</th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground hidden sm:table-cell">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground hidden md:table-cell">Guests</th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground hidden lg:table-cell">Seating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      className={`hover:bg-secondary/50 transition-colors cursor-pointer ${selected?.id === b.id ? "bg-primary/5" : ""}`}
                      onClick={() => setSelected(b)}
                    >
                      <td className="px-4 py-3.5 font-mono text-xs text-primary whitespace-nowrap">{b.referenceNumber}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-foreground">{b.name}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">{b.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{b.date}</td>
                      <td className="px-4 py-3.5 text-muted-foreground hidden sm:table-cell">{b.time}</td>
                      <td className="px-4 py-3.5 text-foreground hidden md:table-cell">{b.guests}</td>
                      <td className="px-4 py-3.5 text-muted-foreground hidden lg:table-cell">{SEAT_LABELS[b.seatType] ?? b.seatType}</td>
                      <td className="px-4 py-3.5"><Badge status={b.status} /></td>
                      <td className="px-4 py-3.5">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail panel overlay */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <BookingPanel
            booking={selected}
            onClose={() => setSelected(null)}
            onUpdate={(updated) => {
              setBookings((prev) => prev.map((b) => b.id === updated.id ? updated : b))
              setSelected(updated)
            }}
            onDelete={(id) => {
              setBookings((prev) => prev.filter((b) => b.id !== id))
              setSelected(null)
            }}
          />
        </>
      )}
    </div>
  )
}
