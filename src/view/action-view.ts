import { Country } from "../model/country";

export interface ActionCommands {
  sendResearchTeamCommand: () => void;
}

export class ActionView {
  private rootElement: HTMLDivElement;
  private allButtons: HTMLButtonElement[] = [];

  constructor(container: HTMLDivElement, commands: ActionCommands) {
    this.rootElement = document.createElement('div');
    this.rootElement.id = 'actions-container';
    this.rootElement.classList.add('view-container');

    const btn = document.createElement('button');
    btn.innerText = 'Send research team';
    btn.addEventListener('click', () => commands.sendResearchTeamCommand());
    this.allButtons.push(btn);

    this.rootElement.appendChild(btn);
    container.appendChild(this.rootElement);

    this.disableButtons();
  }

  public setCountry(country?: Country) {
    (country ? this.enableButtons() : this.disableButtons());
  }

  private disableButtons() {
    this.allButtons.forEach(b => b.setAttribute('disabled', ''));
  }

  private enableButtons() {
    this.allButtons.forEach(b => b.removeAttribute('disabled'))
  }
}