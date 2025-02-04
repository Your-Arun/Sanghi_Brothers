import React from 'react';
import { Users, Briefcase, Globe } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="bg-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        We are committed to excellence
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Our team of professionals is dedicated to providing the best service possible.
                    </p>
                </div>

                <div className="mt-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                            <Users className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg leading-6 font-medium text-gray-900">Our Team</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        We have a diverse and talented team of professionals who are passionate about what they do.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                            <Briefcase className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg leading-6 font-medium text-gray-900">Our Work</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        We take pride in our work and strive to deliver the best results for our clients.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                            <Globe className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg leading-6 font-medium text-gray-900">Our Vision</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        We aim to make a positive impact on the world through our innovative solutions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;