import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Dialog, DialogOptions } from '../src/dialog';
import { dialogManager } from '../src/dialogManager';

// Mock dialogManager to isolate Dialog unit tests
vi.mock('../src/dialogManager', () => {
  const mockDialogManager = {
    registerDialog: vi.fn(),
    unregisterDialog: vi.fn(),
    bringToFront: vi.fn(),
    toggleDialogExpand: vi.fn(),
    minimizeDialog: vi.fn(),
    restoreDialog: vi.fn(),
    activeDialogs: new Map(), // Add activeDialogs for internal checks if needed
  };
  return { dialogManager: mockDialogManager };
});

describe('Dialog', () => {
  let dialog: Dialog;
  const mockOptions: DialogOptions = {
    title: 'Test Dialog',
    content: 'This is a test dialog content.',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Ensure dialogManager.activeDialogs is clean for each test
    (dialogManager.activeDialogs as Map<string, Dialog>).clear();
    dialog = new Dialog(mockOptions);
  });

  afterEach(() => {
    // Clean up any dialog elements left in the DOM
    if (dialog.dialogElement && document.body.contains(dialog.dialogElement)) {
      document.body.removeChild(dialog.dialogElement);
    }
  });

  it('should be instantiated with correct options and a unique ID', () => {
    expect(dialog).toBeInstanceOf(Dialog);
    expect(dialog.id).toMatch(/^fab-dialog-/);
    expect(dialog.options).toEqual({ ...mockOptions, size: 'medium' }); // Default size
    expect(dialog.isMinimized).toBe(false);
    expect(dialog.isExpanded).toBe(false);
  });

  it('should render the dialog element to the document body', () => {
    dialog.render();
    expect(dialog.dialogElement).not.toBeNull();
    expect(document.body.contains(dialog.dialogElement!)).toBe(true);
    expect(dialog.dialogElement!.id).toBe(dialog.id);
    expect(dialog.dialogElement!.querySelector('.fab-dialog-title')!.textContent).toBe(mockOptions.title);
    expect(dialog.dialogElement!.querySelector('.fab-dialog-content')!.innerHTML).toBe(mockOptions.content);
    expect(dialogManager.registerDialog).toHaveBeenCalledWith(dialog);
    expect(dialogManager.bringToFront).toHaveBeenCalledWith(dialog.id);
  });

  it('should call onClose callback and unregister dialog when closed', () => {
    dialog.render();
    dialog.close();
    expect(document.body.contains(dialog.dialogElement!)).toBe(false);
    expect(dialog.dialogElement).toBeNull();
    expect(mockOptions.onClose).toHaveBeenCalledWith(dialog.id);
    expect(dialogManager.unregisterDialog).toHaveBeenCalledWith(dialog.id);
  });

  it('should set initial size correctly for "small"', () => {
    const smallDialog = new Dialog({ ...mockOptions, size: 'small' });
    smallDialog.render();
    const { width, height } = smallDialog.dialogElement!.getBoundingClientRect();
    // These are approximate checks as viewport size varies in JSDOM
    expect(width).toBeGreaterThanOrEqual(300);
    expect(height).toBeGreaterThanOrEqual(200);
    smallDialog.close();
  });

  it('should set initial size correctly for "large"', () => {
    const largeDialog = new Dialog({ ...mockOptions, size: 'large' });
    largeDialog.render();
    const { width, height } = largeDialog.dialogElement!.getBoundingClientRect();
    expect(width).toBeGreaterThanOrEqual(600);
    expect(height).toBeGreaterThanOrEqual(400);
    largeDialog.close();
  });

  it('should set initial size correctly for "full" and set isExpanded to true', () => {
    const fullDialog = new Dialog({ ...mockOptions, size: 'full' });
    fullDialog.render();
    const { width, height } = fullDialog.dialogElement!.getBoundingClientRect();
    expect(width).toBe(window.innerWidth);
    expect(height).toBe(window.innerHeight);
    expect(fullDialog.isExpanded).toBe(true);
    expect(fullDialog.dialogElement!.classList.contains('fab-dialog--expanded')).toBe(true);
    expect(fullDialog._previousPosition).not.toBeNull(); // Should store a non-expanded position
    fullDialog.close();
  });

  it('should call dialogManager.toggleDialogExpand when toggleExpand is called', () => {
    dialog.render();
    dialog.toggleExpand();
    expect(dialogManager.toggleDialogExpand).toHaveBeenCalledWith(dialog.id);
  });

  it('should call dialogManager.minimizeDialog when minimize is called', () => {
    dialog.render();
    dialog.minimize();
    expect(dialogManager.minimizeDialog).toHaveBeenCalledWith(dialog.id);
  });

  it('should call dialogManager.restoreDialog when restore is called', () => {
    dialog.render();
    dialog.restore();
    expect(dialogManager.restoreDialog).toHaveBeenCalledWith(dialog.id);
  });

  it('should update expand icon correctly', () => {
    dialog.render();
    const expandButton = dialog.expandButtonElement!;
    expect(expandButton.innerHTML).toContain('lucide-maximize'); // Initial state

    dialog.setExpandIcon(true); // Expanded
    expect(expandButton.innerHTML).toContain('lucide-minimize');

    dialog.setExpandIcon(false); // Contracted
    expect(expandButton.innerHTML).toContain('lucide-maximize');
  });
});