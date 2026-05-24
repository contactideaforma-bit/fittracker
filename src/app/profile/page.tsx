'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Loader2, User, Scale, Ruler, Calendar, Target } from 'lucide-react'

const GOALS = [
  { value: 'perte de poids',  label: 'Perte de poids' },
  { value: 'prise de masse',  label: 'Prise de masse' },
  { value: 'endurance',       label: 'Endurance' },
  { value: 'forme generale',  label: 'Forme générale' },
  { value: 'performance',     label: 'Performance' },
]

export default function ProfilePage() {
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [form, setForm]         = useState({
    full_name:  '',
    weight_kg:  '',
    height_cm:  '',
    birth_date: '',
    goal:       '',
  })

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setForm({
          full_name:  data.full_name  ?? '',
          weight_kg:  data.weight_kg  ? String(data.weight_kg)  : '',
          height_cm:  data.height_cm  ? String(data.height_cm)  : '',
          birth_date: data.birth_date ?? '',
          goal:       data.goal       ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    await supabase.from('profiles').upsert({
      id:         user.id,
      full_name:  form.full_name.trim()  || null,
      weight_kg:  parseFloat(form.weight_kg)  || null,
      height_cm:  parseInt(form.height_cm)    || null,
      birth_date: form.birth_date || null,
      goal:       form.goal       || null,
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const input = "w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold">Mon profil</h1>
        <p className="text-sm text-zinc-500">Ces informations servent à calculer vos calories précisément</p>
      </div>

      <div className="card flex flex-col gap-4">

        {/* Nom */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
            <User size={13} /> Prénom et nom
          </label>
          <input
            className={input}
            placeholder="ex: Thomas Dupont"
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
          />
        </div>

        {/* Poids + Taille */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
              <Scale size={13} /> Poids (kg)
            </label>
            <input
              type="number" min="30" max="250" step="0.1"
              className={input}
              placeholder="ex: 75"
              value={form.weight_kg}
              onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
              <Ruler size={13} /> Taille (cm)
            </label>
            <input
              type="number" min="100" max="250"
              className={input}
              placeholder="ex: 178"
              value={form.height_cm}
              onChange={e => setForm(f => ({ ...f, height_cm: e.target.value }))}
            />
          </div>
        </div>

        {/* Date de naissance */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
            <Calendar size={13} /> Date de naissance
          </label>
          <input
            type="date"
            className={input}
            value={form.birth_date}
            onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
          />
        </div>

        {/* Objectif */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
            <Target size={13} /> Objectif principal
          </label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => setForm(f => ({ ...f, goal: g.value }))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  form.goal === g.value
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={save}
          disabled={saving}
          className={`btn-primary justify-center py-2.5 transition-all ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}
        >
          {saving
            ? <><Loader2 size={16} className="animate-spin" />Sauvegarde…</>
            : saved
            ? <><Check size={16} />Profil sauvegardé !</>
            : <><Check size={16} />Sauvegarder</>
          }
        </button>

      </div>

      {/* Info calories */}
      <div className="card bg-violet-50 border-violet-100">
        <p className="text-xs text-violet-700 leading-relaxed">
          <span className="font-medium">Pourquoi ces informations ?</span><br />
          Le calcul des calories brûlées utilise votre poids et la durée de la séance. 
          Sans poids renseigné, on utilise 70 kg par défaut — renseignez votre vrai poids pour des calculs précis.
        </p>
      </div>
    </div>
  )
}