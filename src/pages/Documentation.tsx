"use client";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DocumentationSidebar from "@/components/DocumentationSidebar";
import { Info, Moon } from "lucide-react"; // Garder Moon pour l'icône dans la section mode sombre

const Documentation: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Use a slight delay to ensure layout has settled, especially after initial render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <DocumentationSidebar />
        <main className="flex-grow mx-auto p-4 py-8 lg:ml-0 lg:mr-auto lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
            Documentation FabDialog
          </h1>

          <section id="demarrage-rapide" className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Démarrage rapide
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                Cette bibliothèque fournit un gestionnaire de boîtes de dialogue léger et personnalisable,
                ainsi qu'une implémentation de boîtes de dialogue individuelles, le tout en TypeScript vanilla.
                Elle est conçue pour être intégrée facilement dans n'importe quelle application web.
              </p>

              <h3 id="installation" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Installation (dans un projet externe)</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Si le package `fab-dialog` est publié sur npm, vous pouvez l'installer dans n'importe quel projet externe avec :
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm mb-6 overflow-x-auto">
                <code>
                  npm install fab-dialog
                </code>
              </pre>

              <h3 id="utilisation-de-base" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Utilisation de base</h3>
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
                  &nbsp;&nbsp;onClose: (dialogId) =&gt; console.log(&#96;Boîte de dialogue &#36;&#123;dialogId&#125; fermée&#96;),<br />
                  &#125;);<br />
                  <br />
                  // Pour initialiser les onglets de dialogue (nécessite un élément DOM)<br />
                  // const tabsContainer = document.getElementById('dialog-tabs-container');<br />
                  // if (tabsContainer) &#123;<br />
                  // &nbsp;&nbsp;dialogManager.initVanillaTabs(tabsContainer);<br />
                  // &#125;
                </code>
              </pre>
            </div>
          </section>

          <section id="mode-sombre" className="mb-12">
            <h2 className="flex items-center text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              <Moon className="text-blue-500 dark:text-blue-400 mr-2" />Gestion du Mode Sombre
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                Le mode sombre est géré directement dans la librairie.
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Le thème de l'application (clair ou sombre) est géré en ajoutant la classe <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground">light</code> ou <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground">dark</code> directement à la balise <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-muted-foreground">&lt;html&gt;</code> de votre document.
              </p>
            </div>
          </section>

          <section id="dialog-manager" className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              `DialogManager`
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                La classe `DialogManager` est responsable de la gestion du cycle de vie, de l'état et de l'interaction
                de toutes les boîtes de dialogue de l'application. C'est une instance singleton (`dialogManager`)
                que vous devriez utiliser pour interagir avec les boîtes de dialogue.
              </p>
              <Separator className="my-6" />

              <h3 id="dm-methodes" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Méthodes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Méthode</TableHead>
                    <TableHead className="w-[200px]">Propriétés</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">`createDialog(options: DialogOptions): Dialog`</TableCell>
                    <TableCell>
                      `options: DialogOptions` (Obligatoire)
                    </TableCell>
                    <TableCell>
                      Crée et affiche une nouvelle boîte de dialogue.
                      <ul className="list-disc list-inside ml-4 mt-2 text-gray-600 dark:text-gray-400">
                        <li>
                          `options`: Un objet `DialogOptions` définissant le titre, le contenu et un rappel `onClose`.
                        </li>
                      </ul>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`registerDialog(dialog: Dialog)`</TableCell>
                    <TableCell>
                      `dialog: Dialog` (Obligatoire)
                    </TableCell>
                    <TableCell>
                      Enregistre une boîte de dialogue existante auprès du gestionnaire.
                      Généralement appelée en interne par la méthode `render()` de `Dialog`.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`toggleDialogMinimize(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Bascule l'état minimisé/restauré d'une boîte de dialogue.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`minimizeDialog(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Minimise une boîte de dialogue spécifique.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`restoreDialog(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Restaure une boîte de dialogue minimisée.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`toggleDialogExpand(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Bascule l'état agrandi/contracté d'une boîte de dialogue.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`expandDialog(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Agrandit une boîte de dialogue à la taille maximale de la fenêtre.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`contractDialog(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Restaure une boîte de dialogue agrandie à sa taille et position précédentes.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`closeDialog(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Ferme et supprime une boîte de dialogue spécifique.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`unregisterDialog(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>
                      Désenregistre une boîte de dialogue du gestionnaire.
                      Généralement appelée en interne par la méthode `close()` de `Dialog`.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`bringToFront(dialogId: string)`</TableCell>
                    <TableCell>
                      `dialogId: string` (Obligatoire)
                    </TableCell>
                    <TableCell>Amène une boîte de dialogue au premier plan (augmente son `z-index`).</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`initVanillaTabs(containerElement: HTMLElement)`</TableCell>
                    <TableCell>
                      `containerElement: HTMLElement` (Obligatoire)
                    </TableCell>
                    <TableCell>
                      Initialise le système d'onglets pour les boîtes de dialogue.
                      Nécessite un élément DOM (`containerElement`) où les onglets seront rendus.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`onFocusChange(callback: (dialogId: string | null) =&gt; void)`</TableCell>
                    <TableCell>
                      `callback: (dialogId: string | null) =&gt; void` (Obligatoire)
                    </TableCell>
                    <TableCell>Définit un rappel qui sera appelé lorsque la boîte de dialogue focalisée change.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Separator className="my-6" />

              <h3 id="dm-proprietes" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Propriétés</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Propriété</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">`focusedDialogId: string | null`</TableCell>
                    <TableCell>Un accesseur (`getter`) qui renvoie l'ID de la boîte de dialogue actuellement focalisée, ou `null` s'il n'y en a pas.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Separator className="my-6" />

              <h3 id="dm-evenements" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Événements</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Le `DialogManager` émet des événements personnalisés sur l'objet `window` pour les changements d'état des boîtes de dialogue.
                Vous pouvez les écouter comme follows :
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm mb-6 overflow-x-auto">
                <code>
                  window.addEventListener("dialog:opened", (event) =&gt; console.log(event.detail));
                </code>
              </pre>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Événement</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium"><Badge variant="secondary">dialog:opened</Badge></TableCell>
                    <TableCell>Une boîte de dialogue a été ouverte.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><Badge variant="secondary">dialog:closed</Badge></TableCell>
                    <TableCell>Une boîte de dialogue a été fermée.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><Badge variant="secondary">dialog:minimized</Badge></TableCell>
                    <TableCell>Une boîte de dialogue a été minimisée.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><Badge variant="secondary">dialog:restored</Badge></TableCell>
                    <TableCell>Une boîte de dialogue a été restaurée.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><Badge variant="secondary">dialog:expanded</Badge></TableCell>
                    <TableCell>Une boîte de dialogue a été agrandie.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><Badge variant="secondary">dialog:contracted</Badge></TableCell>
                    <TableCell>Une boîte de dialogue a été contractée.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium"><Badge variant="secondary">dialog:focused</Badge></TableCell>
                    <TableCell>Une boîte de dialogue a reçu le focus.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>

          <section id="dialog-class" className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              `Dialog`
            </h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                La classe `Dialog` représente une boîte de dialogue individuelle.
                Bien que vous puissiez l'instancier directement, il est recommandé d'utiliser
                `dialogManager.createDialog()` pour une gestion centralisée.
              </p>
              <Separator className="my-6" />

              <h3 id="creation-dialog-directe" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Création d'une `Dialog` directe</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Vous pouvez créer et afficher une instance de `Dialog` directement, sans passer par le `dialogManager`.
                Cependant, dans ce cas, la boîte de dialogue ne sera pas gérée par le `dialogManager` (elle n'apparaîtra pas dans les onglets, par exemple)
                et vous devrez gérer son cycle de vie manuellement.
              </p>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm mb-6 overflow-x-auto">
                <code>
                  import &#123; Dialog &#125; from "fab-dialog";<br />
                  <br />
                  const myDirectDialog = new Dialog(&#123;<br />
                  &nbsp;&nbsp;title: "Ma boîte de dialogue directe",<br />
                  &nbsp;&nbsp;content: "Ceci est une boîte de dialogue créée directement.",<br />
                  &nbsp;&nbsp;size: 'small',<br />
                  &nbsp;&nbsp;onClose: (id) =&gt; console.log(&#96;Boîte de dialogue directe &#36;&#123;id&#125; fermée&#96;),<br />
                  &#125;);<br />
                  <br />
                  myDirectDialog.render();<br />
                  <br />
                  // Pour la fermer manuellement plus tard :<br />
                  // myDirectDialog.close();
                </code>
              </pre>
              <Separator className="my-6" />

              <h3 id="dialog-options-interface" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Interface `DialogOptions`</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Propriété</TableHead>
                    <TableHead className="w-[250px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">`title`</TableCell>
                    <TableCell>string</TableCell>
                    <TableCell>Le titre affiché dans l'en-tête de la boîte de dialogue.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`content`</TableCell>
                    <TableCell>string | HTMLElement</TableCell>
                    <TableCell>Le contenu de la boîte de dialogue, peut être une chaîne HTML ou un élément DOM.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`onClose?`</TableCell>
                    <TableCell>`(dialogId: string) => void` (optionnel)</TableCell>
                    <TableCell>Une fonction de rappel appelée lorsque la boîte de dialogue est fermée.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`size?`</TableCell>
                    <TableCell>`'small' | 'medium' | 'large' | 'full'` (optionnel)</TableCell>
                    <TableCell>La taille initiale de la boîte de dialogue. Peut être `'small'`, `'medium'` (par défaut), `'large'` ou `'full'`.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Separator className="my-6" />

              <h3 id="dialog-proprietes" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Propriétés</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Propriété</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">`id: string`</TableCell>
                    <TableCell>L'identifiant unique de la boîte de dialogue.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`options: DialogOptions`</TableCell>
                    <TableCell>Les options utilisées pour créer la boîte de dialogue.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`isMinimized: boolean`</TableCell>
                    <TableCell>Indique si la boîte de dialogue est actuellement minimisée.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`isExpanded: boolean`</TableCell>
                    <TableCell>Indique si la boîte de dialogue est actuellement agrandie.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Separator className="my-6" />

              <h3 id="dialog-methodes" className="text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200">Méthodes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Méthode</TableHead>
                    <TableHead className="w-[200px]">Propriétés</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">`render()`</TableCell>
                    <TableCell>Aucune</TableCell>
                    <TableCell>
                      Crée l'élément DOM de la boîte de dialogue et l'ajoute au corps du document.
                      Enregistre également la boîte de dialogue auprès du `dialogManager`.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`toggleExpand()`</TableCell>
                    <TableCell>Aucune</TableCell>
                    <TableCell>Bascule l'état agrandi/contracté de cette boîte de dialogue via le `dialogManager`.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`minimize()`</TableCell>
                    <TableCell>Aucune</TableCell>
                    <TableCell>Minimise cette boîte de dialogue via le `dialogManager`.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`restore()`</TableCell>
                    <TableCell>Aucune</TableCell>
                    <TableCell>Restaure cette boîte de dialogue via le `dialogManager`.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">`close()`</TableCell>
                    <TableCell>Aucune</TableCell>
                    <TableCell>
                      Ferme cette boîte de dialogue, la supprime du DOM et la désenregistre du `dialogManager`.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;