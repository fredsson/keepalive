
export class Virus {
  public readonly name: {official: string, public: string};

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