import { dialogManager } from "./dialogManager"; // Import the dialog manager

export interface DialogOptions {
  title: string;
  content: string | HTMLElement;
  onClose?: () => void;
}

export class Dialog {
  public readonly id: string; // Make id public and readonly
  public dialogElement: HTMLElement | null = null; // Make dialogElement public for manager access
  private options: DialogOptions;
  private isDragging = false;
  private isResizing = false;
  private offsetX = 0;
  private offsetY = 0;
  private initialWidth = 0;
  private initialHeight = 0;
  private initialMouseX = 0;
  private initialMouseY = 0;

  constructor(options: DialogOptions) {
    this.options = options;
    this.id = `fab-dialog-${Math.random().toString(36).substr(2, 9)}`; // Generate unique ID with 'fab-' prefix
  }

  private createDialogElement(): HTMLElement {
    const dialog = document.createElement("div");
    dialog.id = this.id; // Assign ID to the DOM element
    dialog.className = "fab-dialog"; // Use 'fab-' prefix
    // Initial positioning with transform for centering, will be converted to pixels in render()
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.width = "auto"; // Let browser determine initial auto width
    dialog.style.height = "auto"; // Let browser determine initial auto height
    dialog.style.zIndex = "1000"; // Initial z-index, will be updated by manager

    // Add mousedown listener to the dialog itself to bring it to front
    dialog.addEventListener("mousedown", (e) => {
      // Only bring to front if not dragging or resizing
      if (!this.isDragging && !this.isResizing) {
        dialogManager.bringToFront(this.id);
      }
    });

    const header = document.createElement("div");
    header.className = "fab-dialog-header"; // Use 'fab-' prefix
    header.innerHTML = `<h3 class="fab-dialog-title">${this.options.title}</h3>`; // Use 'fab-' prefix

    const closeButton = document.createElement("button");
    closeButton.className = "fab-dialog-close-button"; // Use 'fab-' prefix
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    closeButton.onclick = () => this.close();
    header.appendChild(closeButton);

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "fab-dialog-content"; // Use 'fab-' prefix
    if (typeof this.options.content === "string") {
      contentWrapper.innerHTML = this.options.content;
    } else {
      contentWrapper.appendChild(this.options.content);
    }

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "fab-dialog-resize-handle"; // Use 'fab-' prefix
    // No innerHTML for the icon, as requested

    dialog.appendChild(header);
    dialog.appendChild(contentWrapper);
    dialog.appendChild(resizeHandle);

    this.setupDrag(header, dialog);
    this.setupResize(resizeHandle, dialog);

    return dialog;
  }

  private setupDrag(handle: HTMLElement, element: HTMLElement) {
    const onMouseDown = (e: MouseEvent) => {
      if (this.isResizing) return;
      e.preventDefault(); // Prevent text selection
      e.stopPropagation();
      this.isDragging = true;
      this.offsetX = e.clientX - element.getBoundingClientRect().left;
      this.offsetY = e.clientY - element.getBoundingClientRect().top;
      element.style.cursor = "grabbing";
      document.body.classList.add('no-select'); // Disable text selection
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      dialogManager.bringToFront(this.id); // Bring to front when dragging starts
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault(); // Prevent text selection

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dialogRect = element.getBoundingClientRect();

      let newLeft = e.clientX - this.offsetX;
      let newTop = e.clientY - this.offsetY;

      // Constrain left position
      newLeft = Math.max(0, newLeft); // Cannot go beyond left edge
      newLeft = Math.min(newLeft, viewportWidth - dialogRect.width); // Cannot go beyond right edge

      // Constrain top position
      newTop = Math.max(0, newTop); // Cannot go beyond top edge
      newTop = Math.min(newTop, viewportHeight - dialogRect.height); // Cannot go beyond bottom edge

      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
      // transform is already removed in render()
    };

    const onMouseUp = () => {
      this.isDragging = false;
      element.style.cursor = "grab";
      document.body.classList.remove('no-select'); // Re-enable text selection
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    handle.addEventListener("mousedown", onMouseDown);
  }

  private setupResize(handle: HTMLElement, element: HTMLElement) {
    const onMouseDown = (e: MouseEvent) => {
      if (this.isDragging) return;
      e.preventDefault(); // Prevent text selection
      e.stopPropagation();
      this.isResizing = true;
      this.initialWidth = element.offsetWidth;
      this.initialHeight = element.offsetHeight;
      this.initialMouseX = e.clientX;
      this.initialMouseY = e.clientY;
      element.style.transition = "none";
      document.body.classList.add('no-select'); // Disable text selection
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      dialogManager.bringToFront(this.id); // Bring to front when resizing starts
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing) return;
      e.preventDefault(); // Prevent text selection
      const dx = e.clientX - this.initialMouseX;
      const dy = e.clientY - this.initialMouseY;

      // Reduced min-width to 50px
      element.style.width = `${Math.max(this.initialWidth + dx, 50)}px`;
      element.style.height = `${Math.max(this.initialHeight + dy, 160)}px`;
    };

    const onMouseUp = () => {
      this.isResizing = false;
      element.style.transition = "";
      document.body.classList.remove('no-select'); // Re-enable text selection
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    handle.addEventListener("mousedown", onMouseDown);
  }

  public render() {
    this.dialogElement = this.createDialogElement();
    document.body.appendChild(this.dialogElement);
    dialogManager.registerDialog(this); // Register with the manager

    // After appending to body, calculate and set explicit dimensions and position
    if (this.dialogElement) {
      const rect = this.dialogElement.getBoundingClientRect();
      const initialWidth = Math.max(rect.width, 50); // Respect min-width
      const initialHeight = Math.max(rect.height, 160); // Respect min-height

      this.dialogElement.style.width = `${initialWidth}px`;
      this.dialogElement.style.height = `${initialHeight}px`;

      // Calculate initial centered position in pixels
      const initialLeft = (window.innerWidth - initialWidth) / 2;
      const initialTop = (window.innerHeight - initialHeight) / 2;

      this.dialogElement.style.left = `${initialLeft}px`;
      this.dialogElement.style.top = `${initialTop}px`;
      this.dialogElement.style.transform = "none"; // Remove the translate transform
    }
  }

  public close() {
    if (this.dialogElement && document.body.contains(this.dialogElement)) {
      document.body.removeChild(this.dialogElement);
      this.dialogElement = null;
      dialogManager.unregisterDialog(this.id); // Unregister from the manager
      this.options.onClose?.();
    }
  }
}