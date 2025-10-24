import { dialogManager } from "./dialogManager";

export interface DialogOptions {
  title: string;
  content: string | HTMLElement;
  onClose?: (dialogId: string) => void;
}

export class Dialog {
  public readonly id: string;
  public dialogElement: HTMLElement | null = null;
  public options: DialogOptions;
  public isMinimized: boolean = false;
  public isExpanded: boolean = false;
  public _previousPosition: { left: string; top: string; width: string; height: string; } | null = null; // Made public for manager access

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
    this.id = `fab-dialog-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createDialogElement(): HTMLElement {
    const dialog = document.createElement("div");
    dialog.id = this.id;
    dialog.className = "fab-dialog";
    dialog.style.zIndex = "1000";

    dialog.addEventListener("mousedown", (e) => {
      if (!this.isDragging && !this.isResizing) {
        dialogManager.bringToFront(this.id);
      }
    });

    const header = document.createElement("div");
    header.className = "fab-dialog-header";
    header.innerHTML = `<h3 class="fab-dialog-title">${this.options.title}</h3>`;

    const controls = document.createElement("div");
    controls.className = "fab-dialog-controls";

    // Minimize Button
    const minimizeButton = document.createElement("button");
    minimizeButton.className = "fab-dialog-control-button fab-dialog-minimize-button";
    minimizeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>`;
    minimizeButton.onclick = (e) => {
      e.stopPropagation();
      this.minimize();
    };
    controls.appendChild(minimizeButton);

    // Expand/Restore Button
    const expandButton = document.createElement("button");
    expandButton.className = "fab-dialog-control-button fab-dialog-expand-button";
    expandButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3m-18 0v3a2 2 0 0 0 2 2h3"/></svg>`;
    expandButton.onclick = (e) => {
      e.stopPropagation();
      this.toggleExpand();
    };
    controls.appendChild(expandButton);

    // Close Button
    const closeButton = document.createElement("button");
    closeButton.className = "fab-dialog-control-button fab-dialog-close-button";
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    closeButton.onclick = (e) => {
      e.stopPropagation();
      this.close();
    };
    controls.appendChild(closeButton);

    header.appendChild(controls);

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "fab-dialog-content";
    if (typeof this.options.content === "string") {
      contentWrapper.innerHTML = this.options.content;
    } else {
      contentWrapper.appendChild(this.options.content);
    }

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "fab-dialog-resize-handle";

    dialog.appendChild(header);
    dialog.appendChild(contentWrapper);
    dialog.appendChild(resizeHandle);

    this.setupDrag(header, dialog);
    this.setupResize(resizeHandle, dialog);

    return dialog;
  }

  private setupDrag(handle: HTMLElement, element: HTMLElement) {
    const onMouseDown = (e: MouseEvent) => {
      if (this.isResizing || this.isExpanded) return;
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = true;
      this.offsetX = e.clientX - element.getBoundingClientRect().left;
      this.offsetY = e.clientY - element.getBoundingClientRect().top;
      handle.style.cursor = "grabbing";
      document.body.classList.add('no-select');
      element.style.transition = "none"; // Disable transition during drag
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      dialogManager.bringToFront(this.id);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dialogRect = element.getBoundingClientRect();

      let newLeft = e.clientX - this.offsetX;
      let newTop = e.clientY - this.offsetY;

      newLeft = Math.max(0, newLeft);
      newLeft = Math.min(newLeft, viewportWidth - dialogRect.width);

      newTop = Math.max(0, newTop);
      newTop = Math.min(newTop, viewportHeight - dialogRect.height);

      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      this.isDragging = false;
      handle.style.cursor = "grab";
      document.body.classList.remove('no-select');
      element.style.transition = ""; // Re-enable transition after drag
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    handle.addEventListener("mousedown", onMouseDown);
  }

  private setupResize(handle: HTMLElement, element: HTMLElement) {
    const onMouseDown = (e: MouseEvent) => {
      if (this.isDragging || this.isExpanded) return;
      e.preventDefault();
      e.stopPropagation();
      this.isResizing = true;
      this.initialWidth = element.offsetWidth;
      this.initialHeight = element.offsetHeight;
      this.initialMouseX = e.clientX;
      this.initialMouseY = e.clientY;
      element.style.transition = "none";
      document.body.classList.add('no-select');
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      dialogManager.bringToFront(this.id);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing) return;
      e.preventDefault();
      const dx = e.clientX - this.initialMouseX;
      const dy = e.clientY - this.initialMouseY;

      element.style.width = `${Math.max(this.initialWidth + dx, 50)}px`;
      element.style.height = `${Math.max(this.initialHeight + dy, 160)}px`;
    };

    const onMouseUp = () => {
      this.isResizing = false;
      element.style.transition = "";
      document.body.classList.remove('no-select');
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    handle.addEventListener("mousedown", onMouseDown);
  }

  public render() {
    this.dialogElement = this.createDialogElement();
    document.body.appendChild(this.dialogElement);
    dialogManager.registerDialog(this);

    if (this.dialogElement) {
      const rect = this.dialogElement.getBoundingClientRect();
      const initialWidth = Math.max(rect.width, 50);
      const initialHeight = Math.max(rect.height, 160);

      this.dialogElement.style.width = `${initialWidth}px`;
      this.dialogElement.style.height = `${initialHeight}px`;

      const initialLeft = (window.innerWidth - initialWidth) / 2;
      const initialTop = (window.innerHeight - initialHeight) / 2;

      this.dialogElement.style.left = `${initialLeft}px`;
      this.dialogElement.style.top = `${initialTop}px`;
      this.dialogElement.style.transform = "none";

      this._previousPosition = {
        left: this.dialogElement.style.left,
        top: this.dialogElement.style.top,
        width: this.dialogElement.style.width,
        height: this.dialogElement.style.height,
      };
    }
  }

  public toggleExpand() {
    dialogManager.toggleDialogExpand(this.id);
  }

  public minimize() {
    dialogManager.minimizeDialog(this.id);
  }

  public restore() {
    dialogManager.restoreDialog(this.id);
  }

  public close() {
    if (this.dialogElement && document.body.contains(this.dialogElement)) {
      document.body.removeChild(this.dialogElement);
    }
    this.dialogElement = null; // Ensure dialogElement is nullified
    dialogManager.unregisterDialog(this.id);
    this.options.onClose?.(this.id);
  }
}