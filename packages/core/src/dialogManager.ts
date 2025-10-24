import { Dialog, DialogOptions } from "./dialog";
import { VanillaDialogTabs } from "./vanillaDialogTabs";

export const DIALOG_EVENTS = {
  OPENED: 'dialog:opened',
  CLOSED: 'dialog:closed',
  MINIMIZED: 'dialog:minimized',
  RESTORED: 'dialog:restored',
  EXPANDED: 'dialog:expanded',
  CONTRACTED: 'dialog:contracted',
  FOCUSED: 'dialog:focused',
} as const;

export class DialogManager {
  private activeDialogs: Map<string, Dialog> = new Map();
  private currentMaxZIndex: number = 1000;
  private _focusChangeListener: ((dialogId: string | null) => void) | null = null;
  private _focusedDialogId: string | null = null;
  private _vanillaDialogTabs: VanillaDialogTabs | null = null;

  initVanillaTabs(containerElement?: HTMLElement, position?: 'top' | 'bottom' | 'left' | 'right') {
    this._vanillaDialogTabs = new VanillaDialogTabs(this, { containerElement, position });
    this.updateVanillaTabs();
  }

  private dispatchDialogEvent(eventName: string, dialogId: string, detail?: any) {
    const event = new CustomEvent(eventName, {
      detail: { dialogId, ...detail },
    });
    window.dispatchEvent(event);
  }

  createDialog(options: DialogOptions): Dialog {
    const newDialog = new Dialog(options);
    newDialog.render();
    this.dispatchDialogEvent(DIALOG_EVENTS.OPENED, newDialog.id, { title: options.title });
    return newDialog;
  }

  registerDialog(dialog: Dialog) {
    this.activeDialogs.set(dialog.id, dialog);
    this.bringToFront(dialog.id);
  }

  // Removed onDialogStateChange as it's replaced by more granular events

  toggleDialogMinimize(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (dialog) {
      if (dialog.isMinimized) {
        this.restoreDialog(dialogId);
      } else {
        this.minimizeDialog(dialogId);
      }
    }
  }

  minimizeDialog(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (!dialog || dialog.isMinimized) return;

    if (dialog.isExpanded) {
      this.contractDialog(dialogId); // Contract before minimizing
    }

    dialog.isMinimized = true;
    dialog._previousPosition = { // Store position before removing from DOM
      left: dialog.dialogElement!.style.left,
      top: dialog.dialogElement!.style.top,
      width: dialog.dialogElement!.style.width,
      height: dialog.dialogElement!.style.height,
    };
    if (dialog.dialogElement && document.body.contains(dialog.dialogElement)) {
      document.body.removeChild(dialog.dialogElement);
    }
    this.dispatchDialogEvent(DIALOG_EVENTS.MINIMIZED, dialogId);
    this.updateVanillaTabs();
    this.reassignFocusAfterDialogAction(dialogId);
  }

  restoreDialog(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (!dialog || !dialog.isMinimized) return;

    dialog.isMinimized = false;
    if (dialog.dialogElement && !document.body.contains(dialog.dialogElement)) {
      document.body.appendChild(dialog.dialogElement);
    }

    if (dialog._previousPosition) {
      dialog.dialogElement!.style.left = dialog._previousPosition.left;
      dialog.dialogElement!.style.top = dialog._previousPosition.top;
      dialog.dialogElement!.style.width = dialog._previousPosition.width;
      dialog.dialogElement!.style.height = dialog._previousPosition.height;
      dialog.dialogElement!.style.transform = "none";
    } else {
      // Fallback to center if no previous position
      const rect = dialog.dialogElement!.getBoundingClientRect();
      const initialWidth = Math.max(rect.width, 50);
      const initialHeight = Math.max(rect.height, 160);
      dialog.dialogElement!.style.width = `${initialWidth}px`;
      dialog.dialogElement!.style.height = `${initialHeight}px`;
      const initialLeft = (window.innerWidth - initialWidth) / 2;
      const initialTop = (window.innerHeight - initialHeight) / 2;
      dialog.dialogElement!.style.left = `${initialLeft}px`;
      dialog.dialogElement!.style.top = `${initialTop}px`;
      dialog.dialogElement!.style.transform = "none";
    }
    this.bringToFront(dialogId); // Restore also brings to front
    this.dispatchDialogEvent(DIALOG_EVENTS.RESTORED, dialogId);
    this.updateVanillaTabs();
  }

  toggleDialogExpand(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (!dialog || !dialog.dialogElement) return;

    if (dialog.isExpanded) {
      this.contractDialog(dialogId);
    } else {
      this.expandDialog(dialogId);
    }
  }

  expandDialog(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (!dialog || !dialog.dialogElement || dialog.isExpanded) return;

    if (dialog.isMinimized) {
      this.restoreDialog(dialogId); // Restore before expanding
    }

    const expandButton = dialog.expandButtonElement; // Utilise la référence directe
    if (!expandButton) {
      console.error(`DialogManager: Expand button element not found for dialog ${dialogId} during expand operation.`);
      return;
    }

    dialog._previousPosition = {
      left: dialog.dialogElement.style.left,
      top: dialog.dialogElement.style.top,
      width: dialog.dialogElement.style.width,
      height: dialog.dialogElement.style.height,
    };
    dialog.dialogElement.style.left = '0';
    dialog.dialogElement.style.top = '0';
    dialog.dialogElement.style.width = '100vw';
    dialog.dialogElement.style.height = '100vh';
    dialog.dialogElement.style.transform = 'none';
    dialog.dialogElement.classList.add('fab-dialog--expanded');
    expandButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize"><path d="M8 3v3a2 0 0 1-2 2H3m18 0h-3a2 0 0 1-2-2V3m0 18v-3a2 0 0 1 2-2h3m-18 0h3a2 0 0 1 2 2v3"/></svg>`;
    dialog.isExpanded = true;
    this.dispatchDialogEvent(DIALOG_EVENTS.EXPANDED, dialogId);
    this.updateVanillaTabs();
  }

  contractDialog(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (!dialog || !dialog.dialogElement || !dialog.isExpanded) return;

    const expandButton = dialog.expandButtonElement; // Utilise la référence directe
    if (!expandButton) {
      console.error(`DialogManager: Expand button element not found for dialog ${dialogId} during contract operation.`);
      return;
    }

    if (dialog._previousPosition) {
      dialog.dialogElement.style.left = dialog._previousPosition.left;
      dialog.dialogElement.style.top = dialog._previousPosition.top;
      dialog.dialogElement.style.width = dialog._previousPosition.width;
      dialog.dialogElement.style.height = dialog._previousPosition.height;
    } else {
      // Fallback to center if no previous position
      const rect = dialog.dialogElement.getBoundingClientRect();
      const initialWidth = Math.max(rect.width, 50);
      const initialHeight = Math.max(rect.height, 160);
      dialog.dialogElement.style.width = `${initialWidth}px`;
      dialog.dialogElement.style.height = `${initialHeight}px`;
      const initialLeft = (window.innerWidth - initialWidth) / 2;
      const initialTop = (window.innerHeight - initialHeight) / 2;
      dialog.dialogElement.style.left = `${initialLeft}px`;
      dialog.dialogElement.style.top = `${initialTop}px`;
    }
    dialog.dialogElement.classList.remove('fab-dialog--expanded');
    expandButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize-icon lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 0 0 0-2-2h-3"/><path d="M3 16v3a2 0 0 0 2 2h3"/><path d="M16 21h3a2 0 0 0 2-2v-3"/></svg>`;
    dialog.isExpanded = false;
    this.dispatchDialogEvent(DIALOG_EVENTS.CONTRACTED, dialogId);
    this.updateVanillaTabs();
  }

  closeDialog(dialogId: string) {
    const dialogToClose = this.activeDialogs.get(dialogId);
    if (dialogToClose) {
      dialogToClose.close(); // Dialog.close() will call unregisterDialog
    }
  }

  unregisterDialog(dialogId: string) {
    this.activeDialogs.delete(dialogId);
    this.dispatchDialogEvent(DIALOG_EVENTS.CLOSED, dialogId);
    this.reassignFocusAfterDialogAction(dialogId);
    this.updateVanillaTabs();
  }

  private getHighestZIndex(): number {
    let maxZ = 0;
    this.activeDialogs.forEach(dialog => {
      if (dialog.dialogElement && !dialog.isMinimized) {
        const zIndex = parseInt(dialog.dialogElement.style.zIndex || '0', 10);
        if (zIndex > maxZ) {
          maxZ = zIndex;
        }
      }
    });
    return maxZ;
  }

  bringToFront(dialogId: string) {
    const dialogToFocus = this.activeDialogs.get(dialogId);
    if (!dialogToFocus) return;

    if (dialogToFocus.isMinimized) {
      this.restoreDialog(dialogId); // Use manager's restore method
      return;
    }

    if (dialogToFocus.dialogElement) {
      const currentDialogZIndex = parseInt(dialogToFocus.dialogElement.style.zIndex || '0', 10);
      const highestZIndex = this.getHighestZIndex();

      this.activeDialogs.forEach(dialog => {
        dialog.dialogElement?.classList.remove('fab-dialog--focused');
      });

      if (currentDialogZIndex < highestZIndex || this.activeDialogs.size === 1) {
        this.currentMaxZIndex = highestZIndex + 1;
        dialogToFocus.dialogElement.style.zIndex = String(this.currentMaxZIndex);
      }
      
      dialogToFocus.dialogElement.classList.add('fab-dialog--focused');

      if (this._focusedDialogId !== dialogId) {
        this._focusedDialogId = dialogId;
        this._focusChangeListener?.(dialogId);
        this.dispatchDialogEvent(DIALOG_EVENTS.FOCUSED, dialogId);
      }
      this.updateVanillaTabs();
    }
  }

  private reassignFocusAfterDialogAction(affectedDialogId: string) {
    if (this._focusedDialogId === affectedDialogId) {
      let newFocusedId: string | null = null;
      // Try to find a non-minimized dialog to focus first
      for (const [id, dialog] of this.activeDialogs.entries()) {
        if (!dialog.isMinimized) {
          newFocusedId = id;
          break;
        }
      }

      if (newFocusedId) {
        this.bringToFront(newFocusedId);
      } else {
        this._focusedDialogId = null;
        this._focusChangeListener?.(null);
      }
    }
  }

  updateVanillaTabs() {
    if (this._vanillaDialogTabs) {
      this._vanillaDialogTabs.updateTabs(Array.from(this.activeDialogs.values()), this._focusedDialogId);
    }
  }

  onFocusChange(callback: (dialogId: string | null) => void) {
    this._focusChangeListener = callback;
  }

  get focusedDialogId(): string | null {
    return this._focusedDialogId;
  }
}

export const dialogManager = new DialogManager();