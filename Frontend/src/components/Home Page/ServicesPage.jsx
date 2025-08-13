import { ArrowRight, Fuel, Clock, ShieldCheck, Banknote, Car } from "lucide-react";
import Footer from "./Footer";


const Services = () => {
  const services = [
    {
      title: "Fuel Services",
      description:
        "Premium quality petrol and diesel available 24/7. We ensure accurate measurements and competitive prices.",
      icon: <Fuel className="h-12 w-12 text-blue-600" />,
    },
    {
      title: "Quick Refueling",
      description:
        "Efficient and fast refueling service with multiple dispensing units to minimize waiting time.",
      icon: <Clock className="h-12 w-12 text-blue-600" />,
    },
    {
      title: "Quality Guarantee",
      description:
        "We maintain strict quality controls and regular testing to ensure fuel purity and performance.",
      icon: <ShieldCheck className="h-12 w-12 text-blue-600" />,
    },
    {
      title: "Competitive Pricing",
      description:
        "Daily updated fuel prices following market trends. Special rates for bulk consumers.",
      icon: <Banknote className="h-12 w-12 text-blue-600" />,
    },
    {
      title: "Vehicle Support",
      description:
        "Free air pressure check and basic vehicle assistance available at our station.",
      icon: <Car className="h-12 w-12 text-blue-600" />,
    },
  ];

  return (
    <>
    
    <div className="min-h-screen px-6 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Petrol Pump Services
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Delivering quality fuel and exceptional service to keep your vehicles running smoothly.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-blue-500"
          >
            <div className="mb-4 flex justify-center">{service.icon}</div>
            <h2 className="text-xl font-bold text-center text-gray-900">{service.title}</h2>
            <p className="text-gray-600 text-center mt-2">{service.description}</p>
            <div className="mt-6 flex justify-center">
              <button className="flex bg-blue-500 text-white items-center gap-2 border border-blue-500 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300">
                Learn More <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call-to-Action Section */}
      <div className="text-center mt-20">
        <div className="max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Visit Our Petrol Station Today
          </h2>
          <p className="text-gray-600 text-lg">
            Experience our premium fuel services and dedicated customer support. We're committed to keeping your vehicle running at its best.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-all duration-300">
          Get Directions
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Services;