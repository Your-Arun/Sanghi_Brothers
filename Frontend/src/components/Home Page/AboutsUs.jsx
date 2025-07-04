import React from "react";
import { Users, Briefcase, Globe } from "lucide-react";

const AboutUs = () => {
  const aboutItems = [
    {
      title: "Our Team",
      description:
        "We have a diverse and talented team of professionals who are passionate about what they do.",
      icon: <Users className="h-8 w-8 text-white" />,
    },
    {
      title: "Our Work",
      description:
        "We take pride in our work and strive to deliver the best results for our clients.",
      icon: <Briefcase className="h-8 w-8 text-white" />,
    },
    {
      title: "Our Vision",
      description:
        "We aim to make a positive impact on the world through our innovative solutions.",
      icon: <Globe className="h-8 w-8 text-white" />,
    },
  ];

  return (
    <div className=" py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Committed to Excellence</h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Our team is dedicated to providing the best service possible.
          </p>
        </div>

        {/* About Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {aboutItems.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
            >
              <span className="w-14 h-14 flex items-center justify-center bg-indigo-500 rounded-full shadow-md">
                {item.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Legacy & History Section */}
        <div className="mt-16 space-y-8 mt-2">
          {[
            {
              title: "Legacy",
              image: "/legacy.jpg" ,className:"w-32 h-32 rounded-lg shadow-md object-cover",
              description:
                "Seth Motilal Sanghi diversified into cinema business and profitably operated over ten movie theatres in North India.",className:"text-gray-600 text-xl"
            },
            {
              title: "N K Sanghi",
              image: "/nksanghi.jpg",className:"w-32 h-32 rounded-lg shadow-md object-cover",
              description:
                "Shri Narendra Kumar Sanghi was the eldest son of Seth Motilal Sanghi. He was a disciplined businessman and a social leader.",className:"text-gray-600 text-xl"
            },
            {
              title: "Cinema & Business Empire",
              image: "/group.jpg",
              description:
                "His passion for cinemas helped the automobile group also become a leading exhibitor in the country.",className:"text-gray-600 text-xl"
            },
            {
              title: "Political & Social Influence",
              image: "/1.jpg",className:"w-32 h-32 rounded-lg shadow-md object-cover",
              description:
                "Shri N K Sanghi won the Lok Sabha elections in 1967 & 1971. His social impact is still remembered by his people.",className:"text-gray-600 text-xl"
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex  justify-evenly flex-col md:flex-row items-left ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } space-y-4 md:space-y-0 md:space-x-6 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 ">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-xl">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

