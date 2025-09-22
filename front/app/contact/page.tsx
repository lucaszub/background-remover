"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  Github,
  Linkedin,
  ArrowLeft,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email using EmailJS
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'zubiarrainlucas@gmail.com'
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log('Email sent successfully:', result);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      // You could add an error state here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-full flex flex-col items-center justify-start relative overflow-x-hidden">
      <Header />

      <main className="flex flex-col items-center w-full px-4 max-w-4xl mx-auto pt-10 pb-24">
        {/* Back to Home Link */}
        <div
          className="w-full mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.05s", animationDuration: "800ms" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div
          className="text-center mb-16 animate-fade-in-up"
          style={{ animationDelay: "0.1s", animationDuration: "1000ms" }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Get in{" "}
            <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Have questions about our background removal tool? Need support or
            want to share feedback? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 w-full">
          {/* Contact Form */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationDuration: "1000ms" }}
          >
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-teal-500/20 ring-1 ring-teal-500/30 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-teal-400" />
                </div>
                <h2 className="text-2xl font-semibold">Send us a message</h2>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <p className="text-emerald-400 font-medium">
                    Message sent successfully! We&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-200 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-200 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-neutral-200 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-200 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-colors resize-none"
                    placeholder="Tell us more about your question or feedback..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div
            className="space-y-8 animate-fade-in-up"
            style={{ animationDelay: "0.3s", animationDuration: "1000ms" }}
          >
            {/* Direct Contact */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 ring-1 ring-inset ring-neutral-900">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Contact Me</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-200 mb-1">Email</h4>
                  <a
                    href="mailto:zubiarrainlucas@gmail.com"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    zubiarrainlucas@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-200 mb-1">Phone</h4>
                  <a
                    href="tel:+33619449133"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    +33 6 19 44 91 33
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 ring-1 ring-inset ring-neutral-900">
              <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/lucaszub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-teal-400 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/lucas-zubiarrain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-teal-400 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
