import { DialogManager } from "./dialogManager";
import { Dialog } from "./dialog";

const CHEVRON_LEFT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>`;
const CHEVRON_RIGHT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucude-chevron-right"><path d="m9 18 6-6-6-6"/></svg>`;
const MINUS_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>`;


export class VanillaDialogTabs {
  private containerElement: HTMLElement;
  private dialogManager: DialogManager;
  private tabsListElement: HTMLElement | null = null;
  private tabsScrollWrapper: HTMLElement | null = null;
  private scrollLeftButton: HTMLElement | null = null;
  private scrollRightButton: HTMLElement | null = null;
  private position: 'top' | 'bottom' | 'left' | 'right';

  constructor(dialogManager: DialogManager, options?: { containerElement?: HTMLElement; position?: 'top' | 'bottom' | 'left' | 'right' }) {
    this.dialogManager = dialogManager;
    this.position = options?.position || 'bottom';

    if (!options?.containerElement) {
      this.containerElement = document.createElement("div");
      this.containerElement.id = "fab-dialog-tabs-default-container";
      document.body.appendChild(this.containerElement);
    } else {
      this.containerElement = options.containerElement;
    }
    this.renderBaseStructure();
  }

  private renderBaseStructure() {
    this.containerElement.className = `fab-dialog-tabs-container fab-dialog-tabs-container--${this.position}`;
    this.containerElement.innerHTML = `
      <button class="fab-dialog-scroll-button fab-dialog-scroll-button--left hidden">
          ${CHEVRON_LEFT_ICON_SVG}
      </button>
      <div class="fab-dialog-tabs-scroll-wrapper">
          <div class="fab-dialog-tabs-list"></div>
      </div>
      <button class="fab-dialog-scroll-button fab-dialog-scroll-button--right hidden">
          ${CHEVRON_RIGHT_ICON_SVG}
      </button>
    `;
    this.tabsScrollWrapper = this.containerElement.querySelector(".fab-dialog-tabs-scroll-wrapper");
    this.tabsListElement = this.containerElement.querySelector(".fab-dialog-tabs-list");
    this.scrollLeftButton = this.containerElement.querySelector(".fab-dialog-scroll-button--left");
    this.scrollRightButton = this.containerElement.querySelector(".fab-dialog-scroll-button--right");

    this.scrollLeftButton?.addEventListener("click", () => this.scrollTabs("left"));
    this.scrollRightButton?.addEventListener("click", () => this.scrollTabs("right"));

    this.tabsScrollWrapper?.addEventListener("scroll", () => this.checkScrollButtonsVisibility());
    window.addEventListener("resize", () => this.checkScrollButtonsVisibility());
    this.checkScrollButtonsVisibility(); // Initial check
  }

  private scrollTabs(direction: 'left' | 'right') {
    if (!this.tabsScrollWrapper) return;
    const scrollAmount = 200;

    if (this.position === 'left' || this.position === 'right') {
      // Vertical scrolling
      if (direction === 'left') { // 'left' button now means 'up'
        this.tabsScrollWrapper.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
      } else { // 'right' button now means 'down'
        this.tabsScrollWrapper.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
    } else {
      // Horizontal scrolling (top/bottom)
      if (direction === 'left') {
        this.tabsScrollWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        this.tabsScrollWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  private checkScrollButtonsVisibility() {
    if (!this.tabsScrollWrapper || !this.scrollLeftButton || !this.scrollRightButton) return;

    let scrollDimension: number;
    let clientDimension: number;
    let scrollOffset: number;

    if (this.position === 'left' || this.position === 'right') {
      scrollDimension = this.tabsScrollWrapper.scrollHeight;
      clientDimension = this.tabsScrollWrapper.clientHeight;
      scrollOffset = this.tabsScrollWrapper.scrollTop;
    } else {
      scrollDimension = this.tabsScrollWrapper.scrollWidth;
      clientDimension = this.tabsScrollWrapper.clientWidth;
      scrollOffset = this.tabsScrollWrapper.scrollLeft;
    }

    // Show left/up button if not at the very beginning
    if (scrollOffset > 0) {
      this.scrollLeftButton.classList.remove("hidden");
    } else {
      this.scrollLeftButton.classList.add("hidden");
    }

    // Show right/down button if there's more content
    if (scrollDimension > clientDimension && scrollOffset < scrollDimension - clientDimension - 1) {
      this.scrollRightButton.classList.remove("hidden");
    } else {
      this.scrollRightButton.classList.add("hidden");
    }
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
    // Add a small delay to ensure layout is calculated after DOM updates
    setTimeout(() => this.checkScrollButtonsVisibility(), 0);
  }
}