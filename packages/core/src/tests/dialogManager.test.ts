import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DialogManager, DIALOG_EVENTS } from '../dialogManager';
import { Dialog, DialogOptions } from '../dialog';
import { VanillaDialogTabs } from '../vanillaDialogTabs';

// Mock VanillaDialogTabs to isolate DialogManager tests
vi.mock('../src/vanillaDialogTabs', () => {
  return {
    VanillaDialogTabs: vi.fn(() => ({
      updateTabs: vi.fn(),
    })),
  };
});

describe('DialogManager', () => {
  let manager: DialogManager;
  let mockDialogOptions: DialogOptions;

  beforeEach(() => {
    manager = new DialogManager();
    mockDialogOptions = {
      title: 'Manager Test Dialog',
      content: 'Content for manager test.',
      onClose: vi.fn(),
    };

    // Mock Dialog class to control its behavior in manager tests
    // We need to ensure Dialog instances created by manager.createDialog are mockable
    // and that their render/close methods are controlled.
    // For integration, we might want actual Dialog instances, but for unit testing manager,
    // we want to control Dialog's side effects.
    // Let's use a spy on the actual Dialog class methods for better integration testing.
    vi.spyOn(Dialog.prototype, 'render').mockImplementation(function(this: Dialog) {
      this.dialogElement = document.createElement('div');
      this.dialogElement.id = this.id;
      this.dialogElement.className = 'fab-dialog';
      this.dialogElement.style.zIndex = '1000';
      this.dialogElement.style.left = '100px';
      this.dialogElement.style.top = '100px';
      this.dialogElement.style.width = '400px';
      this.dialogElement.style.height = '300px';
      document.body.appendChild(this.dialogElement);
      manager.registerDialog(this); // Ensure manager registers it
    });
    vi.spyOn(Dialog.prototype, 'close').mockImplementation(function(this: Dialog) {
      if (this.dialogElement && document.body.contains(this.dialogElement)) {
        document.body.removeChild(this.dialogElement);
      }
      this.dialogElement = null;
      manager.unregisterDialog(this.id);
      this.options.onClose?.(this.id);
    });
    vi.spyOn(Dialog.prototype, 'setExpandIcon').mockImplementation(() => {}); // Mock this as it's DOM related
    vi.spyOn(window, 'dispatchEvent'); // Spy on window.dispatchEvent for custom events

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore all spies
    vi.restoreAllMocks();
    // Clean up any dialogs left in the DOM
    manager.activeDialogs.forEach(dialog => {
      if (dialog.dialogElement && document.body.contains(dialog.dialogElement)) {
        document.body.removeChild(dialog.dialogElement);
      }
    });
    manager.activeDialogs.clear();
  });

  it('should create a dialog and register it', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    expect(dialog).toBeInstanceOf(Dialog);
    expect(manager.activeDialogs.has(dialog.id)).toBe(true);
    expect(Dialog.prototype.render).toHaveBeenCalled();
    expect(manager.focusedDialogId).toBe(dialog.id);
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.OPENED }));
  });

  it('should unregister a dialog and dispatch close event', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    manager.unregisterDialog(dialog.id);
    expect(manager.activeDialogs.has(dialog.id)).toBe(false);
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.CLOSED }));
  });

  it('should bring a dialog to front and update z-index', () => {
    const dialog1 = manager.createDialog({ ...mockDialogOptions, title: 'Dialog 1' });
    const dialog2 = manager.createDialog({ ...mockDialogOptions, title: 'Dialog 2' });

    expect(manager.focusedDialogId).toBe(dialog2.id);
    expect(parseInt(dialog2.dialogElement!.style.zIndex)).toBeGreaterThan(parseInt(dialog1.dialogElement!.style.zIndex));

    manager.bringToFront(dialog1.id);
    expect(manager.focusedDialogId).toBe(dialog1.id);
    expect(parseInt(dialog1.dialogElement!.style.zIndex)).toBeGreaterThan(parseInt(dialog2.dialogElement!.style.zIndex));
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.FOCUSED, detail: { dialogId: dialog1.id } }));
  });

  it('should minimize a dialog and remove it from DOM', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    const dialogElement = dialog.dialogElement!;
    manager.minimizeDialog(dialog.id);

    expect(dialog.isMinimized).toBe(true);
    expect(document.body.contains(dialogElement)).toBe(false);
    expect(dialog._previousPosition).not.toBeNull();
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.MINIMIZED }));
    expect((VanillaDialogTabs as any).mock.instances[0].updateTabs).toHaveBeenCalled();
  });

  it('should restore a minimized dialog and add it back to DOM', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    const dialogElement = dialog.dialogElement!;
    manager.minimizeDialog(dialog.id);
    manager.restoreDialog(dialog.id);

    expect(dialog.isMinimized).toBe(false);
    expect(document.body.contains(dialogElement)).toBe(true);
    expect(dialogElement.style.left).toBe(dialog._previousPosition!.left);
    expect(dialogElement.style.top).toBe(dialog._previousPosition!.top);
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.RESTORED }));
    expect(manager.focusedDialogId).toBe(dialog.id); // Restoring brings to front
    expect((VanillaDialogTabs as any).mock.instances[0].updateTabs).toHaveBeenCalled();
  });

  it('should expand a dialog to full screen', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    const dialogElement = dialog.dialogElement!;
    manager.expandDialog(dialog.id);

    expect(dialog.isExpanded).toBe(true);
    expect(dialogElement.classList.contains('fab-dialog--expanded')).toBe(true);
    expect(dialogElement.style.width).toBe('100vw');
    expect(dialogElement.style.height).toBe('100vh');
    expect(dialog._previousPosition).not.toBeNull();
    expect(Dialog.prototype.setExpandIcon).toHaveBeenCalledWith(true);
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.EXPANDED }));
  });

  it('should contract an expanded dialog to its previous size/position', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    const dialogElement = dialog.dialogElement!;
    const initialLeft = dialogElement.style.left;
    const initialTop = dialogElement.style.top;
    const initialWidth = dialogElement.style.width;
    const initialHeight = dialogElement.style.height;

    manager.expandDialog(dialog.id);
    manager.contractDialog(dialog.id);

    expect(dialog.isExpanded).toBe(false);
    expect(dialogElement.classList.contains('fab-dialog--expanded')).toBe(false);
    expect(dialogElement.style.left).toBe(initialLeft);
    expect(dialogElement.style.top).toBe(initialTop);
    expect(dialogElement.style.width).toBe(initialWidth);
    expect(dialogElement.style.height).toBe(initialHeight);
    expect(Dialog.prototype.setExpandIcon).toHaveBeenCalledWith(false);
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.CONTRACTED }));
  });

  it('should close a dialog and remove it from active dialogs', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    manager.closeDialog(dialog.id);
    expect(manager.activeDialogs.has(dialog.id)).toBe(false);
    expect(Dialog.prototype.close).toHaveBeenCalled(); // Dialog's close method handles DOM removal and unregistering
    expect(mockDialogOptions.onClose).toHaveBeenCalledWith(dialog.id);
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.CLOSED }));
    expect((VanillaDialogTabs as any).mock.instances[0].updateTabs).toHaveBeenCalled();
  });

  it('should reassign focus after a dialog is closed', () => {
    const dialog1 = manager.createDialog({ ...mockDialogOptions, title: 'Dialog 1' });
    const dialog2 = manager.createDialog({ ...mockDialogOptions, title: 'Dialog 2' }); // dialog2 is focused

    expect(manager.focusedDialogId).toBe(dialog2.id);
    manager.closeDialog(dialog2.id);
    expect(manager.focusedDialogId).toBe(dialog1.id); // dialog1 should now be focused
    expect(window.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: DIALOG_EVENTS.FOCUSED, detail: { dialogId: dialog1.id } }));
  });

  it('should reassign focus to null if no other dialogs are open', () => {
    const dialog = manager.createDialog(mockDialogOptions);
    expect(manager.focusedDialogId).toBe(dialog.id);
    manager.closeDialog(dialog.id);
    expect(manager.focusedDialogId).toBeNull();
  });

  it('should initialize vanilla tabs and call updateTabs', () => {
    const mockContainer = document.createElement('div');
    manager.initVanillaTabs(mockContainer);
    expect(VanillaDialogTabs).toHaveBeenCalledWith(manager, { containerElement: mockContainer, position: 'bottom' });
    expect((VanillaDialogTabs as any).mock.instances[0].updateTabs).toHaveBeenCalled();
  });

  it('should call focus change listener when focused dialog changes', () => {
    const focusListener = vi.fn();
    manager.onFocusChange(focusListener);

    const dialog1 = manager.createDialog(mockDialogOptions);
    expect(focusListener).toHaveBeenCalledWith(dialog1.id);
    focusListener.mockClear();

    const dialog2 = manager.createDialog({ ...mockDialogOptions, title: 'Dialog 2' });
    expect(focusListener).toHaveBeenCalledWith(dialog2.id);
    focusListener.mockClear();

    manager.bringToFront(dialog1.id);
    expect(focusListener).toHaveBeenCalledWith(dialog1.id);
    focusListener.mockClear();

    manager.closeDialog(dialog1.id);
    expect(focusListener).toHaveBeenCalledWith(dialog2.id);
    focusListener.mockClear();

    manager.closeDialog(dialog2.id);
    expect(focusListener).toHaveBeenCalledWith(null);
  });
});