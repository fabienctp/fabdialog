import { MadeWithDyad } from "@/components/made-with-dyad";
import VanillaDialogWrapper from "@/components/VanillaDialogWrapper"; // Import the new wrapper

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to Your Blank App</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Start building your amazing project here!
        </p>
        <VanillaDialogWrapper
          title="My Custom Vanilla Dialog"
          content="This is a dialog created with your new vanilla TypeScript library! You can drag me around."
        />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;