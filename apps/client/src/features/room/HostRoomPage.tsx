import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Globe, Lock, Unlock, Sparkles, ArrowLeft } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const LANGUAGES = [
  'English',
  'Hindi',
  'Japanese',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Russian'
];

export const HostRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest('/api/rooms', {
        method: 'POST',
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          visibility,
          language
        }
      });

      if (res.success && res.data?.code) {
        navigate(`/room/${res.data.code}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/home')}
        className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text-primary mb-6 transition"
      >
        <ArrowLeft size={14} /> Back to dashboard
      </button>

      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            <Video size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Host a Watch Party</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Set up your theater, invite friends, and watch in synchronized 4K harmony.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Room Name <span className="text-accent-blue">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anime Night, Tech Talk Live, Movie Marathon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Description <span className="text-text-muted font-normal">(Optional)</span>
            </label>
            <textarea
              placeholder="What are you watching? Any house rules?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Visibility */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Visibility
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibility('PUBLIC')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                    visibility === 'PUBLIC'
                      ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                      : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Unlock size={14} />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('PRIVATE')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                    visibility === 'PRIVATE'
                      ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                      : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Lock size={14} />
                  <span>Private</span>
                </button>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Primary Language
              </label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-bg-elevated border border-border-subtle rounded-xl pl-8 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-blue transition appearance-none cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang} className="bg-bg-elevated text-text-primary">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full mt-4 py-3 px-4 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-accent-blue/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Generating Room Code...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Create & Launch Room</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
