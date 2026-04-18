'use client';

import { useEffect, useState } from 'react';
import {
  seedQuestionsIfEmpty,
  fetchAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from '@/lib/game';
import type { Question } from '@/types/game';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [newText, setNewText] = useState('');
  const [newTier, setNewTier] = useState<1 | 2 | 3>(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    await seedQuestionsIfEmpty();
    const qs = await fetchAllQuestions();
    setQuestions(qs as Question[]);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const handleAuth = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setError(''); }
    else setError('Wrong password');
  };

  const handleAdd = async () => {
    if (!newText.trim()) return;
    await addQuestion(newText.trim(), newTier);
    setNewText('');
    await load();
  };

  const handleToggle = async (q: Question) => {
    await updateQuestion(q.id, { active: !q.active });
    await load();
  };

  const handleEditSave = async (id: string) => {
    if (!editText.trim()) return;
    await updateQuestion(id, { text: editText.trim() });
    setEditId(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    await deleteQuestion(id);
    await load();
  };

  if (!authed) {
    return (
      <div className="flex flex-col min-h-screen bg-navy items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-soft text-2xl font-bold mb-6 text-center">Admin</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full bg-surface border border-surface/80 rounded-xl px-4 py-3 text-soft mb-3 focus:outline-none focus:ring-2 focus:ring-gold/40"
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={handleAuth}
            className="w-full py-3 rounded-xl bg-gold text-navy font-bold"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  const tiers = [1, 2, 3] as const;
  const tierLabels = { 1: 'Tier 1 — Light & Fun', 2: 'Tier 2 — Values & Moments', 3: 'Tier 3 — Deep Connection' };

  return (
    <div className="min-h-screen bg-navy px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-soft text-2xl font-bold">Question Bank</h1>
        <span className="text-muted text-sm">{questions.filter((q) => q.active).length} active</span>
      </div>

      {/* Add new question */}
      <div className="bg-surface/60 rounded-2xl p-4 mb-8">
        <p className="text-muted text-xs uppercase tracking-widest mb-3">Add Question</p>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Type your question…"
          rows={2}
          className="w-full bg-card border border-surface/80 rounded-xl px-4 py-3 text-soft text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
        />
        <div className="flex gap-2">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setNewTier(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                newTier === t ? 'border-gold bg-gold/15 text-gold' : 'border-surface text-muted'
              }`}
            >
              T{t}
            </button>
          ))}
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            className="px-4 py-2 rounded-xl bg-gold text-navy font-bold text-sm disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>

      {loading && <p className="text-muted text-center py-8">Loading…</p>}

      {/* Questions by tier */}
      {tiers.map((tier) => {
        const qs = questions.filter((q) => q.tier === tier);
        if (!qs.length) return null;
        return (
          <div key={tier} className="mb-8">
            <p className="text-muted text-xs uppercase tracking-widest mb-3">{tierLabels[tier]} ({qs.length})</p>
            <div className="flex flex-col gap-2">
              {qs.map((q) => (
                <div
                  key={q.id}
                  className={`rounded-xl p-4 border transition-all ${
                    q.active ? 'bg-surface/60 border-surface/80' : 'bg-card border-surface/30 opacity-50'
                  }`}
                >
                  {editId === q.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        className="w-full bg-card rounded-lg px-3 py-2 text-soft text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSave(q.id)} className="px-3 py-1.5 rounded-lg bg-gold text-navy text-xs font-bold">Save</button>
                        <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded-lg bg-surface text-muted text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <p className="flex-1 text-soft text-sm leading-relaxed">{q.text}</p>
                      <div className="flex gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => handleToggle(q)}
                          className={`text-xs px-2 py-1 rounded-lg ${q.active ? 'text-muted hover:text-soft' : 'text-gold'}`}
                          title={q.active ? 'Disable' : 'Enable'}
                        >
                          {q.active ? 'Off' : 'On'}
                        </button>
                        <button
                          onClick={() => { setEditId(q.id); setEditText(q.text); }}
                          className="text-xs px-2 py-1 rounded-lg text-muted hover:text-soft"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="text-xs px-2 py-1 rounded-lg text-muted hover:text-red-400"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
