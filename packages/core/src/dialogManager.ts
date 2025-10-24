import { Dialog } from "./dialog";

class DialogManager {
  private activeDialogs: Map<string, Dialog> = new Map();
  private currentMaxZIndex: number = 1000; // Starting z-index for dialogs
  private _focusChangeListener: ((dialogId: string | null) => void) | null = null; // Listener for focus changes
  private _focusedDialogId: string | null = null; // Keep track of the currently focused dialog ID

  registerDialog(dialog: Dialog) {
    this.activeDialogs.set(dialog.id, dialog);
    this.bringToFront(dialog.id); // Bring new dialog to front by default
  }

  unregisterDialog(dialogId: string) {
    this.activeDialogs.delete(dialogId);
    if (this._focusedDialogId === dialogId) {
      this._focusedDialogId = null; // If the focused dialog is unregistered, clear focus
      this._focusChangeListener?.(null); // Notify listeners
    }
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

      // Remove focused class from all dialogs
      this.activeDialogs.forEach(dialog => {
        dialog.dialogElement?.classList.remove('fab-dialog--focused');
      });

      // Only update z-index if the current dialog is not already the highest
      if (currentDialogZIndex < highestZIndex || this.activeDialogs.size === 1) {
        this.currentMaxZIndex = highestZIndex + 1;
        dialogToFocus.dialogElement.style.zIndex = String(this.currentMaxZIndex);
      }
      
      // Add focused class to the dialog brought to front
      dialogToFocus.dialogElement.classList.add('fab-dialog--focused');

      // Notify if the focused dialog has changed
      if (this._focusedDialogId !== dialogId) {
        this._focusedDialogId = dialogId;
        this._focusChangeListener?.(dialogId);
      }
    }
  }

  // Method to set the focus change listener
  onFocusChange(callback: (dialogId: string | null) => void) {
    this._focusChangeListener = callback;
  }

  // Method to get the currently focused dialog ID
  get focusedDialogId(): string | null {
    return this._focusedDialogId;
  }
}

export const dialogManager = new DialogManager();