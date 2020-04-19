import { Country, CountrySubjectType, ResearchTeamChangedPayload } from "../model/country";
import { Subscription } from "../util/subject";
import { CountryChangedSubject } from "../model/game";
import { ResearchTeam } from "../model/research-team";

export class CountryStatisticsView {
  private rootElement: HTMLDivElement;
  private nameElement: HTMLHeadingElement;
  private populationElement: HTMLSpanElement;
  private infectedElement: HTMLSpanElement;
  private immuneElement: HTMLSpanElement;
  private deceasedElement: HTMLSpanElement;
  private researchTeamInfoElement: HTMLSpanElement;

  private subscription: Subscription | undefined = undefined;

  constructor(container: HTMLDivElement, countrySubject: CountryChangedSubject) {
    this.rootElement = document.createElement('div');
    this.rootElement.id = 'country-stats';
    this.rootElement.classList.add('view-container');
    this.rootElement.classList.add('hidden');

    this.nameElement = document.createElement('h1');

    this.populationElement = document.createElement('span');
    this.infectedElement = document.createElement('span');
    this.immuneElement = document.createElement('span');
    this.deceasedElement = document.createElement('span');
    this.researchTeamInfoElement = document.createElement('div');
    this.researchTeamInfoElement.id = 'test';

    this.rootElement.appendChild(this.nameElement);
    this.rootElement.appendChild(this.populationElement);
    this.rootElement.appendChild(this.infectedElement);
    this.rootElement.appendChild(this.immuneElement);
    this.rootElement.appendChild(this.deceasedElement);
    this.rootElement.appendChild(this.researchTeamInfoElement);
    container.appendChild(this.rootElement);

    countrySubject.onSelectedCountryChanged(payload => {
      if (this.subscription) {
        this.subscription();
      }
      const country = payload.country;

      if (!country) {
        this.rootElement.classList.add('hidden');
        return;
      }

      this.rootElement.classList.remove('hidden');

      this.subscription = country.onPopulationChanged(payload => {
        this.populationElement.innerText = payload.population.toString();
        this.deceasedElement.innerText = payload.noOfDeceased.toString();
      });
      this.subscription = country.onResearchTeamModified(payload => {
        this.buildResearchTeamElement([payload.team], false);
      });

      this.nameElement.innerText = country.name;
      this.populationElement.innerText = country.currentPopulation.toString();
      this.infectedElement.innerText = country.infected.toString();
      this.immuneElement.innerText = country.immune.toString();
      this.deceasedElement.innerText = country.deceased.toString();
      this.buildResearchTeamElement(country.currentResearchTeams, true)
    });
  }

  private buildResearchTeamElement(researchTeams: ResearchTeam[], removePrevious: boolean) {
    if (removePrevious) {
      this.rootElement.removeChild(this.researchTeamInfoElement);
      this.researchTeamInfoElement = document.createElement('div');
      this.researchTeamInfoElement.id = 'test';
      this.rootElement.appendChild(this.researchTeamInfoElement);
    }

    const elems = researchTeams.map(team => {
      const container = document.createElement('div');
      const elem1 = document.createElement('label');
      elem1.innerText = 'Research Team present ';
      const elem = document.createElement('span');
      elem.innerText = `cost ${team.currentHourlyCost}`
      container.appendChild(elem1);
      container.appendChild(elem);
      return container;
    });

    elems.forEach((e) => this.researchTeamInfoElement.appendChild(e));
  }
}