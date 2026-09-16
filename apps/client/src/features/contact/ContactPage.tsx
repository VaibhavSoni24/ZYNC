import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, User, Github } from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await apiRequest('/api/contact', {
        method: 'POST',
        data: formData
      });

      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          Have feedback, questions about the architecture, or want to collaborate? Send a message directly to Vaibhav.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Column */}
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h2 className="text-base font-bold text-text-primary">Contact Information</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-text-muted">
                <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue">
                  <User size={16} />
                </div>
                <div>
                  <span className="block text-[10px] text-text-muted">Developer</span>
                  <span className="font-semibold text-text-primary">Vaibhav Soni</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-text-muted">
                <div className="p-2.5 rounded-xl bg-accent-purple/10 text-accent-purple">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="block text-[10px] text-text-muted">Email</span>
                  <a href="mailto:vaibhavsoni24@gmail.com" className="font-semibold text-text-primary hover:text-accent-blue">
                    vaibhavsoni24@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-text-muted">
                <div className="p-2.5 rounded-xl bg-bg-elevated text-text-muted">
                  <Github size={16} />
                </div>
                <div>
                  <span className="block text-[10px] text-text-muted">GitHub</span>
                  <a
                    href="https://github.com/VaibhavSoni24"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-text-primary hover:text-accent-blue"
                  >
                    github.com/VaibhavSoni24
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle text-[11px] text-text-muted">
            Messages submitted through this form are instantly relayed to Vaibhav via Brevo transactional mail.
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-base font-bold text-text-primary mb-4">Send a Message</h2>

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-xl mb-6 flex items-center gap-3">
              <CheckCircle2 size={20} className="flex-shrink-0" />
              <span>Thank you! Your message has been sent successfully to Vaibhav.</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Taylor Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="taylor@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Share your thoughts, suggestions, or inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl gradient-brand text-white font-semibold text-xs shadow-lg shadow-accent-blue/20 hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Dispatching Message...</span>
              ) : (
                <>
                  <Send size={14} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
