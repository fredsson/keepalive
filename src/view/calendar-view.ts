
export class CalendarView {
  private rootElement: HTMLDivElement;
  private dateElement: HTMLSpanElement;

  constructor(container: HTMLDivElement) {
    this.rootElement = document.createElement('div');
    this.rootElement.id = 'date-container';
    this.rootElement.classList.add('view-container');

    this.dateElement = document.createElement('span');

    this.rootElement.appendChild(this.dateElement);
    container.appendChild(this.rootElement);
  }

  public onCalendarUpdated(date: string) {
    this.dateElement.innerText = date;
  }
}