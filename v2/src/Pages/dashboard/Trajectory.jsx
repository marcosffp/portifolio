import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { MapPin, Plus, Edit2, Trash2, X, Save, Loader } from 'lucide-react'
import { useTranslation } from '../../contexts/LanguageContext'

const TYPES = ['work', 'study', 'volunteering']

const emptyForm = {
  role_pt: '', role_en: '',
  company_pt: '', company_en: '',
  description_pt: '', description_en: '',
  type: 'work',
  start_date: '', end_date: '',
  order_index: 0,
}

function FormInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
      />
    </div>
  )
}

function FormTextArea({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
      />
    </div>
  )
}

const Card = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
)

export default function Trajectory() {
  const { t } = useTranslation()
  const td = t.dashboard
  const tr = t.trajectory
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('pt')

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('trajectory')
      .select('*')
      .order('order_index', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const startNew = () => {
    setForm({ ...emptyForm, order_index: items.length })
    setEditId(null)
    setShowForm(true)
    setTab('pt')
  }

  const startEdit = (item) => {
    setForm({
      role_pt: item.role_pt || '',
      role_en: item.role_en || '',
      company_pt: item.company_pt || '',
      company_en: item.company_en || '',
      description_pt: item.description_pt || '',
      description_en: item.description_en || '',
      type: item.type || 'work',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      order_index: item.order_index ?? 0,
    })
    setEditId(item.id)
    setShowForm(true)
    setTab('pt')
  }

  const cancel = () => {
    setShowForm(false)
    setEditId(null)
    setForm(emptyForm)
  }

  const save = async () => {
    setSaving(true)
    if (editId) {
      await supabase.from('trajectory').update(form).eq('id', editId)
    } else {
      await supabase.from('trajectory').insert(form)
    }
    setSaving(false)
    cancel()
    fetchItems()
  }

  const remove = async (id) => {
    if (!confirm(td.confirmDeleteMilestone)) return
    await supabase.from('trajectory').delete().eq('id', id)
    fetchItems()
  }

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const typeLabels = {
    work: tr.work,
    study: tr.study,
    volunteering: tr.volunteering,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-canvas rounded-xl border border-white/15 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{td.trajectory}</h1>
            <p className="text-gray-500 text-xs">
              {loading ? td.loading : `${items.length} marcos`}
            </p>
          </div>
        </div>
        {!showForm && (
          <button onClick={startNew} className="relative group/b">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-dark to-secondary-dark rounded-xl opacity-60 blur group-hover/b:opacity-100 transition duration-300" />
            <div className="relative flex items-center gap-2 px-4 py-2 bg-canvas rounded-xl border border-white/10">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-gray-200">{td.newMilestone}</span>
            </div>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                {editId ? td.editMilestone : td.addMilestone}
              </h2>
              <button onClick={cancel} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language tabs */}
            <div className="flex gap-2">
              {[['pt', td.ptBRTab], ['en', td.enTab]].map(([lang, label]) => (
                <button
                  key={lang}
                  onClick={() => setTab(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tab === lang
                      ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                      : 'border border-white/10 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Language-specific fields */}
            {tab === 'pt' ? (
              <div className="space-y-3">
                <FormInput label={td.rolePtBR} value={form.role_pt} onChange={v => setField('role_pt', v)} placeholder="ex: Desenvolvedor Frontend" />
                <FormInput label={td.companyPtBR} value={form.company_pt} onChange={v => setField('company_pt', v)} placeholder="ex: Empresa XYZ" />
                <FormTextArea label={td.descriptionPtBR} value={form.description_pt} onChange={v => setField('description_pt', v)} placeholder="Descreva as atividades..." />
              </div>
            ) : (
              <div className="space-y-3">
                <FormInput label={td.roleEn} value={form.role_en} onChange={v => setField('role_en', v)} placeholder="e.g. Frontend Developer" />
                <FormInput label={td.companyEn} value={form.company_en} onChange={v => setField('company_en', v)} placeholder="e.g. XYZ Company" />
                <FormTextArea label={td.descriptionEn} value={form.description_en} onChange={v => setField('description_en', v)} placeholder="Describe the activities..." />
              </div>
            )}

            {/* Shared fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-400">{td.type}</label>
                <select
                  value={form.type}
                  onChange={e => setField('type', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  {TYPES.map(tp => (
                    <option key={tp} value={tp} className="bg-gray-900">{typeLabels[tp]}</option>
                  ))}
                </select>
              </div>
              <FormInput
                label={td.orderIndex}
                value={form.order_index}
                onChange={v => setField('order_index', parseInt(v) || 0)}
                type="number"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput label={td.startDate} value={form.start_date} onChange={v => setField('start_date', v)} placeholder="01/2024" />
              <FormInput label={td.endDate} value={form.end_date} onChange={v => setField('end_date', v)} placeholder={td.endDatePlaceholder} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={cancel}
                className="px-4 py-2 rounded-xl border border-white/10 text-gray-500 hover:text-white text-sm transition-colors"
              >
                {td.cancel}
              </button>
              <button onClick={save} disabled={saving} className="relative group/s">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-dark to-secondary-dark rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
                <div className="relative flex items-center gap-2 px-4 py-2 bg-canvas rounded-xl border border-white/10">
                  {saving
                    ? <Loader className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    : <Save className="w-3.5 h-3.5 text-indigo-400" />
                  }
                  <span className="text-sm text-gray-200">
                    {saving ? td.saving : (editId ? td.updateMilestone : td.saveMilestone)}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <div className="p-4 h-20 animate-pulse" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <MapPin className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{td.noMilestones}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id}>
              <div className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{item.role_pt || item.role_en}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {typeLabels[item.type] || item.type}
                    </span>
                    <span className="text-xs text-gray-600">#{item.order_index}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.company_pt || item.company_en}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {item.start_date}{item.end_date ? ` — ${item.end_date}` : ` — ${tr.current}`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-indigo-300 hover:border-indigo-500/30 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
