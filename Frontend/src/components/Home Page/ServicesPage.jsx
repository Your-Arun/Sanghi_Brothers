import { ArrowRight, Fuel, Clock, ShieldCheck, Banknote, Car } from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Fuel Services",
      description:
        "Premium quality petrol available. We ensure accurate measurements and competitive prices.",
      icon: <Fuel size={28} />,
    },
    {
      title: "Quick Refueling",
      description:
        "Efficient and fast refueling service with multiple dispensing units to minimize waiting time.",
      icon: <Clock size={28} />,
    },
    {
      title: "Quality Guarantee",
      description:
        "We maintain strict quality controls and regular testing to ensure fuel purity and performance.",
      icon: <ShieldCheck size={28} />,
    },
    {
      title: "Competitive Pricing",
      description:
        "Daily updated fuel prices following market trends. Special rates for bulk consumers.",
      icon: <Banknote size={28} />,
    },
    {
      title: "Vehicle Support",
      description:
        "Free air pressure check and basic vehicle assistance available at our station.",
      icon: <Car size={28} />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-yellow-200">
      <div className="pt-14 sm:pt-20 pb-10 sm:pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-yellow-600 font-bold tracking-widest uppercase text-xs sm:text-sm">
            What We Offer
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-5 sm:mb-6">
            Premium Petrol Services
          </h1>
          <div className="h-1.5 w-20 sm:w-24 bg-yellow-500 mx-auto rounded-full mb-5 sm:mb-6" />
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Delivering quality fuel and exceptional service to keep your vehicles running smoothly.
            We are dedicated to efficiency and trust.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-yellow-50 group-hover:bg-yellow-100 transition-colors duration-300" />

              <div className="relative h-12 w-12 sm:h-14 sm:w-14 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                {service.icon}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5 sm:mb-6">
                {service.description}
              </p>

              <button className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                Learn More{" "}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 sm:mb-6">
            Ready to Refuel? Visit Us Today.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-7 sm:mb-8 max-w-2xl mx-auto">
            Experience our premium fuel services and dedicated customer support.
            We are committed to keeping your vehicle running at its best.
          </p>
          <button
            onClick={() =>
              window.open("https://maps.app.goo.gl/xtmPC8keYfEMaXfq7", "_blank")
            }
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/20"
          >
            Get Directions <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
