import { Dialog, DialogOptions } from "./dialog"; // Import DialogOptions as well
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
    newDialog.render(); // Render the dialog to the DOM
    this.registerDialog(newDialog); // Register it with the manager
    return newDialog; // Return the dialog instance
  }

  registerDialog(dialog: Dialog) {
    this.activeDialogs.set(dialog.id, dialog);
    this.bringToFront(dialog.id);
    this.updateVanillaTabs();
  }

  unregisterDialog(dialogId: string) {
    this.activeDialogs.delete(dialogId);

    if (this._focusedDialogId === dialogId) {
      if (this.activeDialogs.size > 0) {
        const firstDialogId = this.activeDialogs.keys().next().value!;
        this.bringToFront(firstDialogId);
      } else {
        this._focusedDialogId = null;
        this._focusChangeListener?.(null);
      }
    }
    this.updateVanillaTabs();
  }

  private getHighestZIndex(): number {
    let maxZ = 0;
    this.activeDialogs.forEach(dialog => {
      if (dialog.dialogElement) {
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
    if (dialogToFocus && dialogToFocus.dialogElement) {
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

  private updateVanillaTabs() {
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