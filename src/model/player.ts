import { ReplaySubject, Subscription, Observer } from "../util/subject";

export interface BalanceSubjectPayload {
  balance: number;
}

export interface AuthoritySubjectPayload {
  authority: number;
}

export interface PlayerReplaySubject {
  onBalanceChanged(observer: Observer<BalanceSubjectPayload>): Subscription;
  onAuthorityChanged(observer: Observer<AuthoritySubjectPayload>): Subscription;
}


export class Player implements PlayerReplaySubject {
  private balanceSubject = new ReplaySubject<BalanceSubjectPayload>();
  private authoritySubject = new ReplaySubject<AuthoritySubjectPayload>();

  private balance: number = 1000000;
  private authority: number = 50;
  private activeResearchTeams: {cost: number}[] = [];

  constructor() {
    this.balanceSubject.notify({balance: this.balance});
    this.authoritySubject.notify({authority: this.authority});
  }

  public update() {
    const contributions = 0;
    const costs = this.activeResearchTeams.reduce((total, team) => total + team.cost, 0);

    this.balance += contributions - costs;
  }

  public onBalanceChanged(observer: Observer<BalanceSubjectPayload>): Subscription {
    return this.balanceSubject.attach(observer);
  }

  public onAuthorityChanged(observer: Observer<AuthoritySubjectPayload>): Subscription {
    return this.authoritySubject.attach(observer);
  }

}
