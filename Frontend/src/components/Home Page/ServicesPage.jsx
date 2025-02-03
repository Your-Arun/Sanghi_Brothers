import { ArrowRight, Fuel, Clock, ShieldCheck, Banknote, Car } from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Fuel Services",
      description: "Premium quality petrol and diesel available 24/7. We ensure accurate measurements and competitive prices.",
      icon: <Fuel className="h-12 w-12 text-primary" />,
    },
    {
      title: "Quick Refueling",
      description: "Efficient and fast refueling service with multiple dispensing units to minimize waiting time.",
      icon: <Clock className="h-12 w-12 text-primary" />,
    },
    {
      title: "Quality Guarantee",
      description: "We maintain strict quality controls and regular testing to ensure fuel purity and performance.",
      icon: <ShieldCheck className="h-12 w-12 text-primary" />,
    },
    {
      title: "Competitive Pricing",
      description: "Daily updated fuel prices following market trends. Special rates for bulk consumers.",
      icon: <Banknote className="h-12 w-12 text-primary" />,
    },
    {
      title: "Vehicle Support",
      description: "Free air pressure check and basic vehicle assistance available at our station.",
      icon: <Car className="h-12 w-12 text-primary" />,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Petrol Pump Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Delivering quality fuel and exceptional service to keep your vehicles running smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="border-t-4 border-t-primary p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h2 className="text-xl font-bold text-center">{service.title}</h2>
              <p className="text-gray-600 text-center">{service.description}</p>
              <div className="mt-6 flex justify-center">
                <button 
                  className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Visit Our Petrol Station Today
            </h2>
            <p className="text-gray-600">
              Experience our premium fuel services and dedicated customer support. We're committed to keeping your vehicle running at its best.
            </p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90">
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;