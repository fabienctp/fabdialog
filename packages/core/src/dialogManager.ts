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

  bringToFront(dialogId: string) {
    const dialog = this.activeDialogs.get(dialogId);
    if (dialog && dialog.dialogElement) {
      this.currentMaxZIndex++;
      dialog.dialogElement.style.zIndex = String(this.currentMaxZIndex);
    }
  }
}

export const dialogManager = new DialogManager();