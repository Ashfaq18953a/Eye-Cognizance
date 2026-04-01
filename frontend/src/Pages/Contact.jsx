import React from "react";
import { FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setError("Failed to send message. Try again.");
      }
    } catch {
      setError("Failed to send message. Try again.");
    }
  };
  return (
    <div>

      {/* Header */}
      <motion.div
        className="bg-[#6A8E4F] text-white py-12 text-center"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-3xl font-bold">Get in Touch</h1>
        <p className="mt-2 text-lg">
          I’m here to help you with any eye-care concerns, appointment queries, or support needs. 
          <br />Reach out anytime — your comfort and clarity matter.
        </p>
      </motion.div>

      {/* Main Section */}
      <div className="p-6 bg-white md:p-12 rounded-2xl shadow-md max-w-7xl mx-auto my-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* LEFT SIDE - Contact Info */}
          <motion.div
            className="space-y-8 bg-[#B0D07D] p-6 rounded-xl"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >

            {/* Phone */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FaPhoneAlt size={20} />
              <div>
                <h3 className="font-semibold text-lg">Call / WhatsApp</h3>
                <p className="text-gray-700 text-sm">+91 XXXXX XXXXX</p>
                <p className="text-gray-500 text-sm">
                  For quick assistance, updates, or questions
                </p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaEnvelope size={20} />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-gray-700 text-sm">support@drmaimunnissa.com</p>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FaClock size={20} />
              <div>
                <h3 className="font-semibold text-lg">Support Hours</h3>
                <p className="text-gray-700 text-sm">Mon–Sat: 9:00 AM – 7:00 PM</p>
                <p className="text-gray-700 text-sm">Sunday: Closed</p>
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT SIDE - Form */}
          <motion.form
            className="space-y-6"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
          >

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-3 w-full"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="border border-gray-300 rounded-md p-3 w-full"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </motion.div>
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="border border-gray-300 rounded-md p-3 w-full h-40"
                placeholder="Write your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              ></textarea>
            </motion.div>

            {/* Button */}
            <motion.button
              type="submit"
              className="bg-[#6A8E4F] text-white px-8 py-3 w-full rounded-full text-lg hover:bg-[#587740] transition"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Send Message
            </motion.button>

            {success && <div className="text-green-600 font-semibold">Message sent successfully!</div>}
            {error && <div className="text-red-600 font-semibold">{error}</div>}

          </motion.form>

        </div>
      </div>
    </div>
  );
};

export default Contact;
