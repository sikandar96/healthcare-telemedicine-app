import "./StatsSection.css";

const stats = [
  { label: "Consultations", value: "24/7" },
  { label: "Partners", value: "180+" },
  { label: "Revenue", value: "3x growth" },
];

function StatsSection() {
  return (
    <section className="stats-grid" aria-label="Platform highlights">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </article>
      ))}
    </section>
  );
}

export default StatsSection;
