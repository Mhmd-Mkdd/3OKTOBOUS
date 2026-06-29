const stats = [
  { value: "8+", label: "Years of Craft" },
  { value: "120+", label: "Brands Served" },
  { value: "400+", label: "Projects Delivered" },
  { value: "24", label: "Team Members" },
];

const values = [
  {
    title: "Craft Over Comfort",
    desc: "We push creative boundaries and never settle for 'good enough.' Every pixel, every frame, every line of code matters.",
  },
  {
    title: "Systems Thinking",
    desc: "Great design isn't just how it looks—it's how it works. We build cohesive systems that scale across every touchpoint.",
  },
  {
    title: "Radical Collaboration",
    desc: "The best work comes from diverse minds. We partner deeply with our clients and each other to bring bold ideas to life.",
  },
];

export function StudioSection() {
  return (
    <>
      <div className="studio-grid">
        <div className="studio-prose">
          <p>
            Octopus was founded on the belief that creative work should feel as
            good as it looks. We're a tight-knit team of designers, developers,
            and storytellers who obsess over the details — from the first
            strategic conversation to the final deployment.
          </p>
          <p>
            Based in Beirut, we work with ambitious brands around the world to
            craft identities, digital experiences, and content that cut through
            the noise. We don't just make things look pretty — we make them
            work.
          </p>
        </div>
        <div className="studio-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="studio-stat">
              <span className="studio-stat__value">{stat.value}</span>
              <span className="studio-stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="studio-values">
        {values.map((value) => (
          <article key={value.title} className="value-card">
            <h3 className="value-card__title">{value.title}</h3>
            <p className="value-card__desc">{value.desc}</p>
          </article>
        ))}
      </div>
    </>
  );
}