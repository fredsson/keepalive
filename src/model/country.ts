
export class Country {
  public readonly id: string;
  public readonly name: string;
  private population: number;

  constructor(id: string, name: string, currentPopulation: number) {
    this.id = id;
    this.name = name;
    this.population = currentPopulation;
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
    return 0;
  }
}
