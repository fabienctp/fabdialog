import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VanillaDialogWrapper from "@/components/VanillaDialogWrapper";
import EventLog from "@/components/EventLog"; // Import the new EventLog component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Bienvenue sur votre application Dyad</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Commencez à construire votre incroyable projet ici !
          </p>
          <VanillaDialogWrapper
            title="Ma boîte de dialogue Vanilla personnalisée"
            content="Ceci est une boîte de dialogue créée avec votre nouvelle bibliothèque TypeScript vanilla ! Vous pouvez me faire glisser."
          />
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Exemple de fonctionnalité 1</CardTitle>
              <CardDescription>Une carte pour présenter une fonctionnalité de votre application.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Ceci est un bloc de contenu où vous pouvez décrire une fonctionnalité clé.
                Utilisez les composants shadcn/ui pour construire des interfaces riches et interactives.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Exemple de fonctionnalité 2</CardTitle>
              <CardDescription>Une autre carte pour une autre fonctionnalité.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Les boîtes de dialogue sont entièrement fonctionnelles, redimensionnables et déplaçables.
                Essayez d'ouvrir plusieurs boîtes de dialogue et de les minimiser !
              </p>
            </CardContent>
          </Card>
        </div>

        <EventLog /> {/* Display the event log */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;