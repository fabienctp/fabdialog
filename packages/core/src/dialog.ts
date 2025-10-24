export interface DialogOptions {
  title: string;
  content: string | HTMLElement;
  onClose?: () => void;
}

export class Dialog {
  private dialogElement: HTMLElement | null = null;
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
  }

  private createDialogElement(): HTMLElement {
    const dialog = document.createElement("div");
    dialog.className = "dyad-dialog fixed bg-background border border-border rounded-lg shadow-lg z-50 min-w-80 min-h-40 flex flex-col resize-none overflow-hidden"; // Added resize-none and overflow-hidden
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.width = "auto"; // Start with auto width/height
    dialog.style.height = "auto";

    const header = document.createElement("div");
    header.className = "dyad-dialog-header flex items-center justify-between p-3 border-b border-border cursor-grab bg-muted text-muted-foreground rounded-t-lg";
    header.innerHTML = `<h3 class="text-lg font-semibold">${this.options.title}</h3>`;

    const closeButton = document.createElement("button");
    closeButton.className = "dyad-dialog-close-button p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors";
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    closeButton.onclick = () => this.close();
    header.appendChild(closeButton);

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "dyad-dialog-content p-4 flex-grow overflow-auto text-foreground";
    if (typeof this.options.content === "string") {
      contentWrapper.innerHTML = this.options.content;
    } else {
      contentWrapper.appendChild(this.options.content);
    }

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "dyad-dialog-resize-handle absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-nwse-resize rounded-br-lg"; // Styling for the handle

    dialog.appendChild(header);
    dialog.appendChild(contentWrapper);
    dialog.appendChild(resizeHandle); // Add the resize handle

    this.setupDrag(header, dialog);
    this.setupResize(resizeHandle, dialog);

    return dialog;
  }

  private setupDrag(handle: HTMLElement, element: HTMLElement) {
    const onMouseDown = (e: MouseEvent) => {
      if (this.isResizing) return; // Prevent dragging while resizing
      this.isDragging = true;
      this.offsetX = e.clientX - element.getBoundingClientRect().left;
      this.offsetY = e.clientY - element.getBoundingClientRect().top;
      element.style.cursor = "grabbing";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      element.style.left = `${e.clientX - this.offsetX}px`;
      element.style.top = `${e.clientY - this.offsetY}px`;
      element.style.transform = "none"; // Remove initial transform for positioning
    };

    const onMouseUp = () => {
      this.isDragging = false;
      element.style.cursor = "grab";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    handle.addEventListener("mousedown", onMouseDown);
  }

  private setupResize(handle: HTMLElement, element: HTMLElement) {
    const onMouseDown = (e: MouseEvent) => {
      this.isResizing = true;
      this.initialWidth = element.offsetWidth;
      this.initialHeight = element.offsetHeight;
      this.initialMouseX = e.clientX;
      this.initialMouseY = e.clientY;
      element.style.transition = "none"; // Disable transitions during resize
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing) return;
      const dx = e.clientX - this.initialMouseX;
      const dy = e.clientY - this.initialMouseY;

      element.style.width = `${Math.max(this.initialWidth + dx, 320)}px`; // Min width 320px (min-w-80)
      element.style.height = `${Math.max(this.initialHeight + dy, 160)}px`; // Min height 160px (min-h-40)
    };

    const onMouseUp = () => {
      this.isResizing = false;
      element.style.transition = ""; // Re-enable transitions
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    handle.addEventListener("mousedown", onMouseDown);
  }

  public render() {
    if (this.dialogElement) {
      this.close(); // Ensure only one instance is rendered
    }
    this.dialogElement = this.createDialogElement();
    document.body.appendChild(this.dialogElement);
  }

  public close() {
    if (this.dialogElement && document.body.contains(this.dialogElement)) {
      document.body.removeChild(this.dialogElement);
      this.dialogElement = null;
      this.options.onClose?.();
    }
  }
}