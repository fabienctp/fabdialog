import { Dialog, DialogOptions } from "./dialog";
import { VanillaDialogTabs } from "./vanillaDialogTabs";

export class DialogManager {
  private activeDialogs: Map<string, Dialog> = new Map();
  private currentMaxZIndex: number = 1000;
  private _focusChangeListener: ((dialogId: string | null) => void) | null = null;
  private _focusedDialogId: string | null = null;
  private _vanillaDialogTabs: VanillaDialogTabs | null = null;

  initVanillaTabs(containerElement: HTMLElement) {
    this._vanillaDialogTabs = new VanillaDialogTabs(containerElement, this);
    this.updateVanillaTabs();
  }

  createDialog(options: DialogOptions): Dialog {
    const newDialog = new Dialog(options);
    newDialog.render();
    return newDialog;
  }

  registerDialog(dialog: Dialog) {
    this.activeDialogs.set(dialog.id, dialog);
    this.bringToFront(dialog.id);
  }

  onDialogStateChange(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (dialog && !dialog.isMinimized) {
      this.bringToFront(dialogId);
    } else {
      this.updateVanillaTabs();
    }
  }

  toggleDialogMinimize(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (dialog) {
      if (dialog.isMinimized) {
        dialog.restore();
      } else {
        dialog.minimize();
      }
    }
  }

  toggleDialogExpand(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (dialog) {
      dialog.toggleExpand();
    }
  }

  closeDialog(dialogId: string) {
    const dialogToClose = this.activeDialogs.get(dialogId);
    if (dialogToClose) {
      dialogToClose.close();
    }
  }

  unregisterDialog(dialogId: string) {
    this.activeDialogs.delete(dialogId);

    if (this._focusedDialogId === dialogId) {
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
        // If no non-minimized dialogs are left, clear the focus.
        // Do not bring a minimized dialog to the front automatically.
        this._focusedDialogId = null;
        this._focusChangeListener?.(null);
      }
    }
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
      dialogToFocus.restore();
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
      }
      this.updateVanillaTabs();
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