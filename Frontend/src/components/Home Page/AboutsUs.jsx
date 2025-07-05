import React from "react";
import { Users, Briefcase, Globe } from "lucide-react";

const AboutUs = () => {
  const aboutItems = [
    {
      title: "Our Team",
      description:
        "We have a diverse and talented team of professionals who are passionate about what they do.",
      icon: <Users className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: "Our Work",
      description:
        "We take pride in our work and strive to deliver the best results for our clients.",
      icon: <Briefcase className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: "Our Vision",
      description:
        "We aim to make a positive impact on the world through our innovative solutions.",
      icon: <Globe className="h-8 w-8 text-yellow-500" />,
    },
  ];

  const legacyItems = [
    {
      title: "Legacy",
      image: "/legacy.jpg",
      description:
        "Seth Motilal Sanghi diversified into cinema business and profitably operated over ten movie theatres in North India.",
    },
    {
      title: "N K Sanghi",
      image: "/nksanghi.jpg",
      description:
        "Shri Narendra Kumar Sanghi was the eldest son of Seth Motilal Sanghi. He was a disciplined businessman and a social leader.",
    },
    {
      title: "Cinema & Business Empire",
      image: "/group.jpg",
      description:
        "His passion for cinemas helped the automobile group also become a leading exhibitor in the country.",
    },
    {
      title: "Political & Social Influence",
      image: "/1.jpg",
      description:
        "Shri N K Sanghi won the Lok Sabha elections in 1967 & 1971. His social impact is still remembered by his people.",
    },
  ];

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Icons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center mb-20">
          {aboutItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-yellow-400 rounded-full shadow-md">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-800">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">{item.description}</p>
            </div>
          ))}
        </div>

        {/* About Heading */}
        <div className="text-left mb-12">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-yellow-500 inline-block mb-4">
            About Us
          </h2>
        </div>

        {/* Legacy Section */}
        <div className="space-y-12">
          {legacyItems.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              } gap-6 md:gap-12`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
