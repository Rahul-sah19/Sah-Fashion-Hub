import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      lines: ["New Road, Kathmandu", "Bagmati Province, Nepal 44600"],
    },
    {
      icon: Phone,
      title: "Call Us",
      lines: ["+977 9841234567", "+977 01-4123456"],
    },
    {
      icon: Mail,
      title: "Email Us",
      lines: ["info@sahfashionhub.com", "support@sahfashionhub.com"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      lines: ["Sunday - Friday: 10AM - 7PM", "Saturday: 11AM - 5PM"],
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Get in Touch
          </h1>
          <p className="mt-1 text-gray-500">
            We'd love to hear from you. Reach out with any questions or feedback.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">Send a Message</h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            {submitted && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <Check size={18} />
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 transition-all hover:bg-rose-700"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact info + map */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contactInfo.map((info, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <info.icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {info.title}
                  </h3>
                  {info.lines.map((line, j) => (
                    <p key={j} className="mt-1 text-xs text-gray-500">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="relative h-64 bg-gradient-to-br from-rose-100 to-amber-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={40} className="mx-auto text-rose-600" />
                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      New Road, Kathmandu
                    </p>
                    <p className="text-xs text-gray-500">Bagmati, Nepal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                Follow Us
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Stay updated with our latest collections and offers
              </p>
              <div className="mt-4 flex gap-3">
                {["Facebook", "Instagram", "Twitter", "TikTok"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-rose-600 hover:text-rose-600"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
