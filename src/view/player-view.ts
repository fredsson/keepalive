import { PlayerReplaySubject } from "../model/player";

export class PlayerView {
  private rootElement: HTMLDivElement;
  private balanceElement: HTMLSpanElement;
  private authorityElement: HTMLSpanElement;

  constructor(container: HTMLDivElement, subject: PlayerReplaySubject) {
    this.rootElement = document.createElement('div');
    this.rootElement.id = 'player-container';
    this.rootElement.classList.add('view-container');

    const balanceLabel = document.createElement('label');
    balanceLabel.innerText = 'Balance';
    this.balanceElement = document.createElement('span');
    const authorityLabel = document.createElement('label');
    authorityLabel.innerText = 'Authority';
    this.authorityElement = document.createElement('span');

    this.rootElement.appendChild(balanceLabel);
    this.rootElement.appendChild(this.balanceElement);
    this.rootElement.appendChild(authorityLabel);
    this.rootElement.appendChild(this.authorityElement);
    container.appendChild(this.rootElement);

    subject.onAuthorityChanged(payload => {
      this.authorityElement.innerText = payload.authority.toString();
    });

    subject.onBalanceChanged(payload => {
      this.balanceElement.innerText = payload.balance.toString();
    });
  }
}