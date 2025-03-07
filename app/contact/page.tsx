"use client"; // Required for client-side interactivity

import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function ContactUs() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      <br />
      <br />

      {/* Main Content */}
      <section className="flex-grow py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Contact Us</h2>

          {/* Grid Layout: Form + Contact Info */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Send Us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    📞
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">Phone</p>
                    <p className="text-gray-800 font-medium">+1 (123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    📧
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">Email</p>
                    <p className="text-gray-800 font-medium">support@campusmarket.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    🏢
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">Address</p>
                    <p className="text-gray-800 font-medium">
                      KU Main Campus
                      <br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Location</h3>
                <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {/* Embed a Google Map for KU Main Campus */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819476038079!2d36.82121431475391!3d-1.283385899063456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d7b3f5b1f5%3A0x1f0b0b0b0b0b0b0b!2sKU%20Main%20Campus!5e0!3m2!1sen!2ske!4v1633023226785!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}