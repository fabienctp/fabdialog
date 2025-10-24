import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VanillaDialogWrapper from "@/components/VanillaDialogWrapper";
import EventLog from "@/components/EventLog";
import HeroBanner from "@/components/HeroBanner"; // Import the new HeroBanner component

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center">
        <HeroBanner /> {/* Display the HeroBanner */}

        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Gestionnaire de Boîtes de Dialogue</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Créez, minimisez, restaurez et gérez vos boîtes de dialogue avec facilité.
          </p>
          <VanillaDialogWrapper
            title="Ma boîte de dialogue Vanilla personnalisée"
            content="Ceci est une boîte de dialogue créée avec votre nouvelle bibliothèque TypeScript vanilla ! Vous pouvez me faire glisser."
          />
        </div>

        {/* Removed "Exemple de fonctionnalité 1" and "Exemple de fonctionnalité 2" cards */}
        
        <div className="mt-8 w-full max-w-md">
          <EventLog /> {/* Display the event log */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;