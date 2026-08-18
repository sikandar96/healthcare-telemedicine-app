import "./ServicesSection.css";

const services = [
  {
    title: "Doctor Consultations",
    description: "Video/audio calls with certified doctors.",
  },
  {
    title: "Medicine Delivery",
    description: "Tie-ups with local pharmacies.",
  },
  {
    title: "Health Awareness",
    description: "Preventive care, vaccination reminders.",
  },
];

function ServicesSection() {
  return (
    <section className="services-grid" id="services">
      {services.map((service) => (
        <article key={service.title} className="service-card">
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </article>
      ))}
    </section>
  );
}

export default ServicesSection;
