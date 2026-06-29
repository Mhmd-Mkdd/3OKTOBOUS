const services = [
  {
    title: "Photography",
    description:
      "High-end commercial and editorial photography that captures the essence of your brand with cinematic precision.",
    icon: "◉",
  },
  {
    title: "Video Editing",
    description:
      "Professional post-production, color grading, motion graphics, and sound design for content that demands attention.",
    icon: "▶",
  },
  {
    title: "Content Production",
    description:
      "End-to-end content strategy and production tailored for digital platforms, from concept to final delivery.",
    icon: "◎",
  },
  {
    title: "Digital Marketing",
    description:
      "Data-driven campaigns that amplify your reach across social, search, and display networks with measurable results.",
    icon: "◆",
  },
  {
    title: "Web Development",
    description:
      "Custom websites and web applications built with modern frameworks, optimized for performance and conversion.",
    icon: "◇",
  },
  {
    title: "App Development",
    description:
      "Native and cross-platform mobile applications designed to deliver seamless user experiences at scale.",
    icon: "▣",
  },
];

export function ServicesSection() {
  return (
    <div className="services-grid">
      {services.map((service) => (
        <article key={service.title} className="service-card">
          <span className="service-card__icon" aria-hidden="true">
            {service.icon}
          </span>
          <h3 className="service-card__title">{service.title}</h3>
          <p className="service-card__desc">{service.description}</p>
        </article>
      ))}
    </div>
  );
}