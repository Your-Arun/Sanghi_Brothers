import React from 'react';
import { Users, Briefcase, Globe } from 'lucide-react';

const AboutUs = () => {
    const aboutItems = [
        {
            title: "Our Team",
            description: "We have a diverse and talented team of professionals who are passionate about what they do.",
            icon: <Users className="h-8 w-8 text-white" />,
        },
        {
            title: "Our Work",
            description: "We take pride in our work and strive to deliver the best results for our clients.",
            icon: <Briefcase className="h-8 w-8 text-white" />,
        },
        {
            title: "Our Vision",
            description: "We aim to make a positive impact on the world through our innovative solutions.",
            icon: <Globe className="h-8 w-8 text-white" />,
        },
    ];

    return (
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        We are Committed to Excellence
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Our team of professionals is dedicated to providing the best service possible.
                    </p>
                </div>

                {/* About Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {aboutItems.map((item, index) => (
                        <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col items-center text-center">
                                <span className="flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-full shadow-lg">
                                    {item.icon}
                                </span>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">{item.title}</h3>
                                <p className="mt-3 text-gray-600">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
 