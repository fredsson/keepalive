
export class ActionView {
  private rootElement: HTMLDivElement;
  constructor(container: HTMLDivElement) {
    this.rootElement = document.createElement('div');
    this.rootElement.id = 'actions-container';
    this.rootElement.classList.add('view-container');

    container.appendChild(this.rootElement);
  }
}