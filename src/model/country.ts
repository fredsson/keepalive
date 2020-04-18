import { Virus } from "./virus";
import { Observer, Subject, Subscription } from "../subject";

interface PopulationChangedEvent {
  population: number;
  noOfDeceased: number;
}

export class Country {
  private subject = new Subject<PopulationChangedEvent>();
  private activeViruses: Virus[] = [];
  public readonly id: string;
  public readonly name: string;
  private population: number;
  private noOfDeceased: number = 0;

  constructor(id: string, name: string, currentPopulation: number) {
    this.id = id;
    this.name = name;
    this.population = currentPopulation;
  }

  public addVirus(virus: Virus) {
    this.activeViruses.push(virus);
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

  public onPopulationChanged(observer: Observer<PopulationChangedEvent>): Subscription {
    return this.subject.attach(observer);
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

  private handleNoMorePopulation() {
    this.population = 0;
    this.activeViruses = [];
    this.notifyPopulationChanged();
  }

  private notifyPopulationChanged() {
    this.subject.notify({population: this.currentPopulation, noOfDeceased: this.noOfDeceased});
  }
}
