import { dialogManager } from "./dialogManager";

export interface DialogOptions {
  title: string;
  content: string | HTMLElement;
  onClose?: (dialogId: string) => void;
  size?: 'small' | 'medium' | 'large' | 'full'; // Nouvelle option de taille
}

const MAXIMIZE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize-icon lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`;
const MINIMIZE_ICON_SVG_FOR_EXPAND = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize-icon lucide-minimize"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>`;


export class Dialog {
  public readonly id: string;
  public dialogElement: HTMLElement | null = null;
  public options: DialogOptions;
  public isMinimized: boolean = false;
  public isExpanded: boolean = false;
  public _previousPosition: { left: string; top: string; width: string; height: string; } | null = null;

  // Références aux éléments des boutons de contrôle
  public minimizeButtonElement: HTMLElement | null = null;
  public expandButtonElement: HTMLElement | null = null;
  public closeButtonElement: HTMLElement | null = null;

  private isDragging = false;
  private isResizing = false;
  private offsetX = 0;
  private offsetY = 0;
  private initialWidth = 0;
  private initialHeight = 0;
  private initialMouseX = 0;
  private initialMouseY = 0;

  constructor(options: DialogOptions) {
    this.options = { ...options, size: options.size || 'medium' }; // 'medium' par défaut
    this.id = `fab-dialog-${Math.random().toString(36).substr(2, 9)}`;
  }

  private _calculateDimensions(size: DialogOptions['size']): { width: number; height: number } {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let width: number;
    let height: number;

    switch (size) {
      case 'small':
        width = Math.max(viewportWidth * 0.3, 300); // 30% de la largeur, min 300px
        height = Math.max(viewportHeight * 0.4, 200); // 40% de la hauteur, min 200px
        break;
      case 'large':
        width = Math.max(viewportWidth * 0.7, 600); // 70% de la largeur, min 600px
        height = Math.max(viewportHeight * 0.8, 400); // 80% de la hauteur, min 400px
        break;
      case 'full':
        width = viewportWidth; // 100% de la largeur
        height = viewportHeight; // 100% de la hauteur
        break;
      case 'medium':
      default:
        width = Math.max(viewportWidth * 0.5, 400); // 50% de la largeur, min 400px
        height = Math.max(viewportHeight * 0.6, 300); // 60% de la hauteur, min 300px
        break;
    }

    return { width, height };
  }

  private createDialogElement(): HTMLElement {
    const dialog = document.createElement("div");
    dialog.id = this.id;
    dialog.className = "fab-dialog";
    dialog.style.zIndex = "1000";

    dialog.addEventListener("mousedown", (_e) => {
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
    this.minimizeButtonElement = document.createElement("button");
    this.minimizeButtonElement.className = "fab-dialog-control-button fab-dialog-minimize-button";
    this.minimizeButtonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>`;
    this.minimizeButtonElement.onclick = (e) => {
      e.stopPropagation();
      this.minimize();
    };
    controls.appendChild(this.minimizeButtonElement);

    // Expand/Restore Button
    this.expandButtonElement = document.createElement("button");
    this.expandButtonElement.className = "fab-dialog-control-button fab-dialog-expand-button";
    this.expandButtonElement.innerHTML = MAXIMIZE_ICON_SVG; // Initial icon is maximize
    this.expandButtonElement.onclick = (e) => {
      e.stopPropagation();
      this.toggleExpand();
    };
    controls.appendChild(this.expandButtonElement);

    // Close Button
    this.closeButtonElement = document.createElement("button");
    this.closeButtonElement.className = "fab-dialog-control-button fab-dialog-close-button";
    this.closeButtonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    this.closeButtonElement.onclick = (e) => {
      e.stopPropagation();
      this.close();
    };
    controls.appendChild(this.closeButtonElement);

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
      if (this.isResizing || this.isExpanded) return; // Disable drag if expanded
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
      if (this.isDragging || this.isExpanded) return; // Disable resize if expanded
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

      element.style.width = `${Math.max(this.initialWidth + dx, 300)}px`; // Minimum width
      element.style.height = `${Math.max(this.initialHeight + dy, 200)}px`; // Minimum height
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
      const { width, height } = this._calculateDimensions(this.options.size);
      this.dialogElement.style.width = `${width}px`;
      this.dialogElement.style.height = `${height}px`;

      let initialLeft = (window.innerWidth - width) / 2;
      let initialTop = (window.innerHeight - height) / 2;

      this.dialogElement.style.left = `${initialLeft}px`;
      this.dialogElement.style.top = `${initialTop}px`;
      this.dialogElement.style.transform = "none";

      if (this.options.size === 'full') {
        this.isExpanded = true;
        this.dialogElement.classList.add('fab-dialog--expanded');
        this.setExpandIcon(true);
        // Pour la taille 'full', _previousPosition doit être un état non agrandi par défaut
        const { width: mediumWidth, height: mediumHeight } = this._calculateDimensions('medium');
        const mediumLeft = (window.innerWidth - mediumWidth) / 2;
        const mediumTop = (window.innerHeight - mediumHeight) / 2;
        this._previousPosition = {
          left: `${mediumLeft}px`,
          top: `${mediumTop}px`,
          width: `${mediumWidth}px`,
          height: `${mediumHeight}px`,
        };
      } else {
        this.isExpanded = false;
        this.dialogElement.classList.remove('fab-dialog--expanded');
        this.setExpandIcon(false);
        this._previousPosition = {
          left: this.dialogElement.style.left,
          top: this.dialogElement.style.top,
          width: this.dialogElement.style.width,
          height: this.dialogElement.style.height,
        };
      }
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

  // Méthodes pour mettre à jour l'icône d'expansion/contraction
  public setExpandIcon(isExpanded: boolean) {
    if (this.expandButtonElement) {
      this.expandButtonElement.innerHTML = isExpanded ? MINIMIZE_ICON_SVG_FOR_EXPAND : MAXIMIZE_ICON_SVG;
    }
  }
}