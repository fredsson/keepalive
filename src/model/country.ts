import { Virus } from "./virus";
import { Observer, Subject, Subscription } from "../util/subject";
import { ResearchTeam } from "./research-team";

export interface PopulationChangedPayload {
  population: number;
  noOfDeceased: number;
}

export interface ResearchTeamChangedPayload {
  added: boolean;
  team: ResearchTeam;
}

export enum CountrySubjectType {
  PopulationChanged = 'PopulationChanged',
  ResearchTeamModified = 'ResearchTeamModified'
}

export interface CountrySubject {
  onPopulationChanged(observer: Observer<PopulationChangedPayload>): Subscription;
  onResearchTeamModified(observer: Observer<ResearchTeamChangedPayload>): Subscription;
}



export class Country {
  private populationSubject = new Subject<PopulationChangedPayload>();
  private researchTeamSubject = new Subject<ResearchTeamChangedPayload>();

  private activeViruses: Virus[] = [];
  public readonly id: string;
  public readonly name: string;
  private population: number;
  private noOfDeceased: number = 0;
  private researchTeams: ResearchTeam[] = [];

  constructor(id: string, name: string, currentPopulation: number) {
    this.id = id;
    this.name = name;
    this.population = currentPopulation;
  }

  public get currentResearchTeams() {
    return this.researchTeams;
  }

  public addVirus(virus: Virus) {
    this.activeViruses.push(virus);
  }

  public addResearchTeam(team: ResearchTeam) {
    this.researchTeams.push(team);
    this.researchTeamSubject.notify({added: true, team: team});
  }

  public update() {
    this.activeViruses.forEach(virus => {
      this.population -= virus.mortalityPerHour;
      this.noOfDeceased += virus.mortalityPerHour;
      if (this.population <= 0) {
        this.handleNoMorePopulation();
      }
    });
    if (this.activeViruses.length) {
      this.notifyPopulationChanged();
    }
  }

  public get currentPopulation() {
    return this.population;
  }

  public get infected() {
    return 0;
  }

  public get immune() {
    return 0;
  }

  public get deceased() {
    return this.noOfDeceased;
  }

  public onPopulationChanged(observer: Observer<PopulationChangedPayload>): Subscription {
    return this.populationSubject.attach(observer);
  }

  public onResearchTeamModified(observer: Observer<ResearchTeamChangedPayload>): Subscription {
    return this.researchTeamSubject.attach(observer);
  }

  private handleNoMorePopulation() {
    this.population = 0;
    this.activeViruses = [];
    this.notifyPopulationChanged();
  }

  private notifyPopulationChanged() {
    const payload = {population: this.currentPopulation, noOfDeceased: this.noOfDeceased};
    this.populationSubject.notify(payload);
  }
}
