import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SocialMedia from "./SocialMedia";

export default function Contact() {
  return (
    <>
    <Header />
    <div className="min-h-screen py-10 px-4 bg-gray-100 text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">
          If you have any questions, feel free to reach out to us!
        </p>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Your message"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
    <Footer />
    <SocialMedia />
    </>
  );
}
