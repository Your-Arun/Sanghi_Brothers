import React from "react";
import { Users, Briefcase, Globe } from "lucide-react";

const AboutUs = () => {
  const aboutItems = [
    {
      title: "Our Team",
      description:
        "We have a diverse and talented team of professionals who are passionate about driving excellence.",
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: "Our Work",
      description:
        "We take pride in our operational standards and strive to deliver the best results for our clients.",
      icon: <Briefcase className="h-8 w-8" />,
    },
    {
      title: "Our Vision",
      description:
        "We aim to make a positive impact on the community through innovative solutions and honest service.",
      icon: <Globe className="h-8 w-8" />,
    },
  ];

  const legacyItems = [
    {
      title: "The Beginning",
      subtitle: "Seth Motilal Sanghi",
      image: "/legacy.jpg",
      description:
        "Seth Motilal Sanghi diversified into the cinema business and profitably operated over ten movie theatres in North India, laying the foundation for a legacy built on enterprise and vision.",
    },
    {
      title: "The Visionary",
      subtitle: "N K Sanghi",
      image: "/nksanghi.jpg",
      description:
        "Shri Narendra Kumar Sanghi was the eldest son of Seth Motilal Sanghi. A disciplined businessman and a social leader, he steered the group towards new heights with unwavering integrity.",
    },
    {
      title: "Expansion",
      subtitle: "Cinema & Business Empire",
      image: "/group.jpg",
      description:
        "His passion for cinemas helped the automobile group also become a leading exhibitor in the country, creating a diverse business portfolio that stood the test of time.",
    },
    {
      title: "Legacy & Influence",
      subtitle: "Political & Social Impact",
      image: "/1.jpg",
      description:
        "Shri N K Sanghi won the Lok Sabha elections in 1967 & 1971. His social impact is still remembered by his people, marking a blend of business success and public service.",
    },
  ];

  return (
    <div className="bg-white font-sans selection:bg-yellow-200">
      
      {/* --- HERO / HEADER --- */}
      <div className="bg-gray-50 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-yellow-600 font-bold tracking-widest uppercase text-sm">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-6">
            About Sanghi Brothers
          </h1>
          <div className="h-1.5 w-24 bg-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 leading-relaxed">
            A legacy of trust, leadership, and service that spans generations. 
            From cinema to fuel, our journey is defined by excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* --- CORE VALUES (Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {aboutItems.map((item, i) => (
            <div 
              key={i} 
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-xl mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* --- LEGACY SECTION (Zig-Zag) --- */}
        <div className="space-y-24">
          {legacyItems.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                i % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 relative group">
                {/* Decorative border offset */}
                <div className="absolute inset-0 border-2 border-yellow-500 rounded-2xl transform translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500 hidden sm:block"></div>
                
                <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <span className="text-yellow-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                  {item.subtitle}
                </span>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {item.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutUs;