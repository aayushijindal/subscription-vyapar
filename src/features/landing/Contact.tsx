import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/services/api/axios';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      await apiClient.post('/public/contact/', formData);
      setSubmitStatus('success');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-input relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-light/40 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-rise">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-6">
            Let's get in <span className="text-primary">touch.</span>
          </h1>
          <p className="text-lg text-text-secondary mb-10 max-w-lg">
            Have questions about First Computer ERP? Our team is here to help you set up your workspace and scale your operations.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Phone Support</h3>
                <p className="text-text-secondary mt-1">+91 94260 64310</p>
                <p className="text-sm text-text-muted">Mon-Sat, 9am to 6pm IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Email</h3>
                <p className="text-text-secondary mt-1">sanjay_zindal@rediffmail.com</p>
                <p className="text-sm text-text-muted">We aim to reply within 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Office</h3>
                <p className="text-text-secondary mt-1">Ahmedabad, Gujarat, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-[32px] p-8 md:p-10 border border-border/60 shadow-2xl shadow-slate-200/40 animate-rise" style={{ animationDelay: '200ms' }}>
          <h3 className="text-2xl font-bold text-text-primary mb-6">Send a message</h3>
          
          {submitStatus === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-emerald-900 mb-2">Message Sent!</h4>
              <p className="text-emerald-700 text-sm">Thank you for reaching out. We will get back to you shortly.</p>
              <Button 
                className="mt-6" 
                variant="outline" 
                onClick={() => setSubmitStatus('idle')}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {submitStatus === 'error' && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">First Name *</label>
                  <input 
                    type="text" 
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border py-3 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-input/50" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Last Name</label>
                  <input 
                    type="text" 
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border py-3 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-input/50" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border py-3 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-input/50" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border py-3 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-input/50" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border py-3 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-input/50" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Message *</label>
                <textarea 
                  rows={4} 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border py-3 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-input/50 resize-none"
                ></textarea>
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl gap-2 mt-4"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <>Send Message <Send className="h-4 w-4" /></>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
