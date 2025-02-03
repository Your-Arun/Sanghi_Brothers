import axios from 'axios';
import React, { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        try {
            // Send form data to the server
            const response = await axios.post('/contact/contactus', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            // Check if the response status is in the 200 range
            if (response.status >= 200 && response.status < 300) {
                alert('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' }); // Reset form data
            } else {
                alert('Failed to send message.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again later.');
        }
    };

    return (

        <>
        
        <div className="flex flex-col md:flex-row justify-center items-center h-[70vh] bg-gradient-to-r from-blue-200 to-green-200">
      
            <div className="m-4 w-full md:w-1/2">
                
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-red-600 mb-6">
                    "We'd love to hear from you!"
                </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
            <div className="m-4 w-full md:w-1/2">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.409611980526!2d73.01631247476406!3d26.2808180869613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418c4988d1fb21%3A0x8d0289bfdadecc10!2s Sanghi%20Brothers%20Petrol%20Pump!5e0!3m2!1sen!2sin!4v1735299586647!5m2!1sen!2sin" 
                    width="100%"
                    height="450"
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Maps"
                    className="rounded-lg shadow-lg"
                ></iframe>
            </div>
        </div>
        </>
    );
};

export default ContactUs;