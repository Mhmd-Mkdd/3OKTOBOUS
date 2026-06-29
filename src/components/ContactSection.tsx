import { type FormEvent, useState } from "react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-thanks">
        <span className="contact-thanks__icon" aria-hidden="true">
          ✓
        </span>
        <h3>Message Received</h3>
        <p>
          Thanks for reaching out. We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <div className="contact-form__group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            required
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </div>
        <div className="contact-form__group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            required
            placeholder="jane@company.com"
            autoComplete="email"
          />
        </div>
      </div>
      <div className="contact-form__group">
        <label htmlFor="message">Tell Us About Your Project</label>
        <textarea
          id="message"
          required
          rows={5}
          placeholder="What are you looking to build? What's your timeline? Any specific requirements?"
        />
      </div>
      <button className="button button--primary contact-form__submit" type="submit">
        Send Message
      </button>
    </form>
  );
}