import { DialogManager } from "./dialogManager";
import { Dialog } from "./dialog"; // Import Dialog to get its structure

interface VanillaDialogTab {
  id: string;
  title: string;
}

export class VanillaDialogTabs {
  private containerElement: HTMLElement;
  private dialogManager: DialogManager;
  private tabsListElement: HTMLElement | null = null;

  constructor(containerElement: HTMLElement, dialogManager: DialogManager) {
    this.containerElement = containerElement;
    this.dialogManager = dialogManager;
    this.renderBaseStructure();
  }

  private renderBaseStructure() {
    this.containerElement.className = "fab-dialog-tabs-container"; // Add a class for styling
    this.containerElement.innerHTML = `
      <div class="fab-dialog-tabs-list"></div>
    `;
    this.tabsListElement = this.containerElement.querySelector(".fab-dialog-tabs-list");
  }

  public updateTabs(openDialogs: Dialog[], focusedDialogId: string | null) {
    if (!this.tabsListElement) return;

    // Clear existing tabs
    this.tabsListElement.innerHTML = "";

    if (openDialogs.length === 0) {
      this.containerElement.style.display = "none"; // Hide the container if no dialogs
      return;
    } else {
      this.containerElement.style.display = "flex"; // Show the container if dialogs exist
    }

    openDialogs.forEach((dialog) => {
      const tabElement = document.createElement("button");
      tabElement.className = "fab-dialog-tab";
      if (dialog.id === focusedDialogId) {
        tabElement.classList.add("fab-dialog-tab--selected");
      }
      tabElement.setAttribute("data-dialog-id", dialog.id);

      const titleSpan = document.createElement("span");
      titleSpan.className = "fab-dialog-tab-title";
      titleSpan.textContent = dialog.options.title;
      tabElement.appendChild(titleSpan);

      const closeButton = document.createElement("button");
      closeButton.className = "fab-dialog-tab-close-button";
      closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
      closeButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent tab selection when closing
        this.dialogManager.unregisterDialog(dialog.id); // This will also close the dialog
      });
      tabElement.appendChild(closeButton);

      tabElement.addEventListener("click", () => {
        this.dialogManager.bringToFront(dialog.id);
      });

      this.tabsListElement?.appendChild(tabElement);
    });
  }
}