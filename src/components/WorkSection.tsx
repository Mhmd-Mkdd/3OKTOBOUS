const projects = [
  {
    title: "Nebula Identity",
    category: "Branding & Web",
    gradient: "linear-gradient(135deg, #00a0ff, #7e50ff)",
  },
  {
    title: "Echo Campaign",
    category: "Video Production",
    gradient: "linear-gradient(135deg, #7e50ff, #fd00ff)",
  },
  {
    title: "Prism App",
    category: "App Development",
    gradient: "linear-gradient(135deg, #fd00ff, #ff6b35)",
  },
  {
    title: "Vertex Studios",
    category: "Photography & Branding",
    gradient: "linear-gradient(135deg, #ff6b35, #00a0ff)",
  },
];

export function WorkSection() {
  return (
    <div className="work-grid">
      {projects.map((project) => (
        <a
          key={project.title}
          className="work-card"
          href="#"
          style={
            {
              "--card-gradient": project.gradient,
            } as React.CSSProperties
          }
        >
          <div className="work-card__visual" aria-hidden="true">
            <div className="work-card__shape" />
          </div>
          <div className="work-card__body">
            <span className="work-card__category">{project.category}</span>
            <h3 className="work-card__title">{project.title}</h3>
          </div>
        </a>
      ))}
    </div>
  );
}