import { DialogManager } from "./dialogManager";
import { Dialog } from "./dialog";

const MINUS_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>`;

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
    this.containerElement.className = "fab-dialog-tabs-container";
    this.containerElement.innerHTML = `
      <div class="fab-dialog-tabs-list"></div>
    `;
    this.tabsListElement = this.containerElement.querySelector(".fab-dialog-tabs-list");
  }

  public updateTabs(allDialogs: Dialog[], focusedDialogId: string | null) {
    if (!this.tabsListElement) return;

    this.tabsListElement.innerHTML = "";

    if (allDialogs.length === 0) {
      this.containerElement.style.display = "none";
      return;
    } else {
      this.containerElement.style.display = "flex";
    }

    allDialogs.forEach((dialog) => {
      const tabElement = document.createElement("button");
      tabElement.className = "fab-dialog-tab";
      tabElement.setAttribute("data-dialog-id", dialog.id);

      if (dialog.id === focusedDialogId && !dialog.isMinimized) {
        tabElement.classList.add("fab-dialog-tab--selected");
      }
      if (dialog.isMinimized) {
        tabElement.classList.add("fab-dialog-tab--minimized");
      }

      const titleSpan = document.createElement("span");
      titleSpan.className = "fab-dialog-tab-title";
      titleSpan.textContent = dialog.options.title;
      tabElement.appendChild(titleSpan);

      if (dialog.isMinimized) {
        const restoreIcon = document.createElement("span");
        restoreIcon.className = "fab-dialog-tab-status-icon";
        restoreIcon.innerHTML = MINUS_ICON_SVG;
        tabElement.prepend(restoreIcon);
      }

      const closeButton = document.createElement("button");
      closeButton.className = "fab-dialog-tab-close-button";
      closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
      closeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dialogManager.closeDialog(dialog.id);
      });
      tabElement.appendChild(closeButton);

      tabElement.addEventListener("click", () => {
        if (dialog.isMinimized) {
          this.dialogManager.toggleDialogMinimize(dialog.id);
        } else {
          this.dialogManager.bringToFront(dialog.id);
        }
      });

      this.tabsListElement?.appendChild(tabElement);
    });
  }
}