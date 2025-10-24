import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VanillaDialogWrapper from "@/components/VanillaDialogWrapper";
import EventLog from "@/components/EventLog";
import HeroBanner from "@/components/HeroBanner";
import FeaturesSection from "@/components/FeaturesSection"; // Import the new FeaturesSection component
import { useEffect } from "react"; // Import useEffect
import { useLocation } from "react-router-dom"; // Import useLocation

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center">
        <HeroBanner /> {/* Display the HeroBanner */}

        <FeaturesSection /> {/* Display the new FeaturesSection */}

        <div id="dialog-manager-section" className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8 w-full">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Gestionnaire de Boîtes de Dialogue</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Créez, minimisez, restaurez et gérez vos boîtes de dialogue avec facilité.
          </p>
          <VanillaDialogWrapper
            title="Ma boîte de dialogue Vanilla personnalisée"
            content="Ceci est une boîte de dialogue créée avec votre nouvelle bibliothèque TypeScript vanilla ! Vous pouvez me faire glisser."
          />
        </div>
        
        <div className="mt-8 w-full">
          <EventLog /> {/* Display the event log */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;