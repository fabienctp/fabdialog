"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
          Documentation de la Bibliothèque de Boîtes de Dialogue Vanilla
        </h1>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            Démarrage Rapide
          </h2>
          <Card className="p-6">
            <CardContent>
              <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                Cette bibliothèque fournit un gestionnaire de boîtes de dialogue léger et personnalisable,
                ainsi qu'une implémentation de boîtes de dialogue individuelles, le tout en TypeScript vanilla.
                Elle est conçue pour être intégrée facilement dans n'importe quelle application web.
              </p>

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Installation (dans un projet externe)</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Si le package `fab-dialog` est publié sur npm, vous pouvez l'installer dans n'importe quel projet externe avec :
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm mb-6 overflow-x-auto">
                <code>
                  npm install fab-dialog
                </code>
              </pre>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Pour publier le package sur npm, assurez-vous d'abord de le compiler :
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm mb-6 overflow-x-auto">
                <code>
                  cd packages/core<br />
                  npm run build<br />
                  npm publish
                </code>
              </pre>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Le fichier `packages/core/package.json` est configuré avec la propriété `files` pour inclure uniquement les dossiers `dist` (contenant le code JavaScript compilé) et `src` (contenant les fichiers TypeScript pour les définitions de types) lors de la publication. Cela garantit que votre package est léger et contient tout le nécessaire pour les consommateurs.
              </p>

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Utilisation de base</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Importez le `dialogManager` et la classe `Dialog` depuis le package `fab-dialog`.
                Le `dialogManager` est une instance singleton qui gère toutes les boîtes de dialogue actives.
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
                <code>
                  import &#123; dialogManager &#125; from "fab-dialog";<br />
                  <br />
                  // Pour ouvrir une nouvelle boîte de dialogue<br />
                  dialogManager.createDialog(&#123;<br />
                  &nbsp;&nbsp;title: "Ma nouvelle boîte de dialogue",<br />
                  &nbsp;&nbsp;content: "Ceci est le contenu de ma boîte de dialogue.",<br />
                  &nbsp;&nbsp;onClose: (dialogId) => console.log(`Boîte de dialogue &#123;dialogId&#125; fermée`),<br />
                  &#125;);<br />
                  <br />
                  // Pour initialiser les onglets de dialogue (nécessite un élément DOM)<br />
                  // const tabsContainer = document.getElementById('dialog-tabs-container');<br />
                  // if (tabsContainer) &#123;<br />
                  // &nbsp;&nbsp;dialogManager.initVanillaTabs(tabsContainer);<br />
                  // &#125;
                </code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            `DialogManager`
          </h2>
          <Card className="p-6">
            <CardContent>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                La classe `DialogManager` est responsable de la gestion du cycle de vie, de l'état et de l'interaction
                de toutes les boîtes de dialogue de l'application. C'est une instance singleton (`dialogManager`)
                que vous devriez utiliser pour interagir avec les boîtes de dialogue.
              </p>
              <Separator className="my-6" />

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Méthodes</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `createDialog(options: DialogOptions): Dialog`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Crée et affiche une nouvelle boîte de dialogue.
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 text-gray-600 dark:text-gray-400">
                    <li>
                      `options`: Un objet `DialogOptions` définissant le titre, le contenu et un rappel `onClose`.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `registerDialog(dialog: Dialog)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Enregistre une boîte de dialogue existante auprès du gestionnaire.
                    Généralement appelée en interne par la méthode `render()` de `Dialog`.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `toggleDialogMinimize(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Bascule l'état minimisé/restauré d'une boîte de dialogue.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `minimizeDialog(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Minimise une boîte de dialogue spécifique.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `restoreDialog(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Restaure une boîte de dialogue minimisée.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `toggleDialogExpand(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Bascule l'état agrandi/contracté d'une boîte de dialogue.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `expandDialog(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Agrandit une boîte de dialogue à la taille maximale de la fenêtre.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `contractDialog(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Restaure une boîte de dialogue agrandie à sa taille et position précédentes.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `closeDialog(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ferme et supprime une boîte de dialogue spécifique.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `unregisterDialog(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Désenregistre une boîte de dialogue du gestionnaire.
                    Généralement appelée en interne par la méthode `close()` de `Dialog`.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `bringToFront(dialogId: string)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Amène une boîte de dialogue au premier plan (augmente son `z-index`).
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `initVanillaTabs(containerElement: HTMLElement)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Initialise le système d'onglets pour les boîtes de dialogue.
                    Nécessite un élément DOM (`containerElement`) où les onglets seront rendus.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `onFocusChange(callback: (dialogId: string | null) => void)`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Définit un rappel qui sera appelé lorsque la boîte de dialogue focalisée change.
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Propriétés</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `focusedDialogId: string | null`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Un accesseur (`getter`) qui renvoie l'ID de la boîte de dialogue actuellement focalisée, ou `null` s'il n'y en a pas.
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Événements</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Le `DialogManager` émet des événements personnalisés sur l'objet `window` pour les changements d'état des boîtes de dialogue.
                Vous pouvez les écouter comme suit :
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm mb-6 overflow-x-auto">
                <code>
                  window.addEventListener("dialog:opened", (event) => console.log(event.detail));
                </code>
              </pre>
              <ul className="list-disc list-inside ml-4 mt-2 text-gray-600 dark:text-gray-400">
                <li><Badge variant="secondary" className="mr-2">dialog:opened</Badge> : Une boîte de dialogue a été ouverte.</li>
                <li><Badge variant="secondary" className="mr-2">dialog:closed</Badge> : Une boîte de dialogue a été fermée.</li>
                <li><Badge variant="secondary" className="mr-2">dialog:minimized</Badge> : Une boîte de dialogue a été minimisée.</li>
                <li><Badge variant="secondary" className="mr-2">dialog:restored</Badge> : Une boîte de dialogue a été restaurée.</li>
                <li><Badge variant="secondary" className="mr-2">dialog:expanded</Badge> : Une boîte de dialogue a été agrandie.</li>
                <li><Badge variant="secondary" className="mr-2">dialog:contracted</Badge> : Une boîte de dialogue a été contractée.</li>
                <li><Badge variant="secondary" className="mr-2">dialog:focused</Badge> : Une boîte de dialogue a reçu le focus.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            `Dialog`
          </h2>
          <Card className="p-6">
            <CardContent>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                La classe `Dialog` représente une boîte de dialogue individuelle.
                Bien que vous puissiez l'instancier directement, il est recommandé d'utiliser
                `dialogManager.createDialog()` pour une gestion centralisée.
              </p>
              <Separator className="my-6" />

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Interface `DialogOptions`</h3>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm mb-6 overflow-x-auto">
                <code>
                  interface DialogOptions &#123;<br />
                  &nbsp;&nbsp;title: string;<br />
                  &nbsp;&nbsp;content: string | HTMLElement;<br />
                  &nbsp;&nbsp;onClose?: (dialogId: string) => void;<br />
                  &#125;
                </code>
              </pre>
              <ul className="list-disc list-inside ml-4 mt-2 text-gray-600 dark:text-gray-400">
                <li>`title`: Le titre affiché dans l'en-tête de la boîte de dialogue.</li>
                <li>`content`: Le contenu de la boîte de dialogue, peut être une chaîne HTML ou un élément DOM.</li>
                <li>`onClose` (optionnel): Une fonction de rappel appelée lorsque la boîte de dialogue est fermée.</li>
              </ul>

              <Separator className="my-6" />

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Propriétés</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `id: string`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    L'identifiant unique de la boîte de dialogue.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `options: DialogOptions`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Les options utilisées pour créer la boîte de dialogue.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `isMinimized: boolean`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Indique si la boîte de dialogue est actuellement minimisée.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `isExpanded: boolean`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Indique si la boîte de dialogue est actuellement agrandie.
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Méthodes</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `render()`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Crée l'élément DOM de la boîte de dialogue et l'ajoute au corps du document.
                    Enregistre également la boîte de dialogue auprès du `dialogManager`.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `toggleExpand()`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Bascule l'état agrandi/contracté de cette boîte de dialogue via le `dialogManager`.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `minimize()`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Minimise cette boîte de dialogue via le `dialogManager`.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `restore()`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Restaure cette boîte de dialogue via le `dialogManager`.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    `close()`
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ferme cette boîte de dialogue, la supprime du DOM et la désenregistre du `dialogManager`.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;