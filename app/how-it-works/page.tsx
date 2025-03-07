import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      <br/>

      {/* Main Content - How It Works Section */}
      <section className="flex-grow py-16 px-4 md:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow-md rounded-md">🔹 Sign Up</div>
          <div className="bg-white p-6 shadow-md rounded-md">🔹 List Your Skill</div>
          <div className="bg-white p-6 shadow-md rounded-md">🔹 Get Hired & Sell</div>
          <div className="bg-white p-6 shadow-md rounded-md">🔹 Receive Payments</div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}