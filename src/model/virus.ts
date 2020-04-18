
export class Virus {
  public readonly name: {official: string, public: string};
  public readonly mortalityPerHour: number = Math.round(30 + (Math.random() * 70));

  constructor() {
    this.name = this.generateName();
  }

  private generateName(): {official: string, public: string} {
    return {
      official: 'COVID-19',
      public: 'Coronavirus'
    };
  }
}