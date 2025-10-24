import { Dialog } from "./dialog";

class DialogManager {
  private activeDialogs: Map<string, Dialog> = new Map();
  private currentMaxZIndex: number = 1000; // Starting z-index for dialogs

  registerDialog(dialog: Dialog) {
    this.activeDialogs.set(dialog.id, dialog);
    this.bringToFront(dialog.id); // Bring new dialog to front by default
  }

  unregisterDialog(dialogId: string) {
    this.activeDialogs.delete(dialogId);
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
    const dialog = this.activeDialogs.get(dialogId);
    if (dialog && dialog.dialogElement) {
      const currentDialogZIndex = parseInt(dialog.dialogElement.style.zIndex || '0', 10);
      const highestZIndex = this.getHighestZIndex();

      // Only update if the current dialog is not already the highest
      if (currentDialogZIndex < highestZIndex || this.activeDialogs.size === 1) {
        this.currentMaxZIndex = highestZIndex + 1;
        dialog.dialogElement.style.zIndex = String(this.currentMaxZIndex);
      }
    }
  }
}

export const dialogManager = new DialogManager();