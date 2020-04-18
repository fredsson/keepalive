import { Country } from "../model/country";
import { Subscription } from "../subject";

export class CountryStatisticsView {
  rootElement: HTMLDivElement;
  nameElement: HTMLHeadingElement;
  populationElement: HTMLSpanElement;
  infectedElement: HTMLSpanElement;
  immuneElement: HTMLSpanElement;
  deceasedElement: HTMLSpanElement;

  private subscription: Subscription | undefined = undefined;

  constructor(container: HTMLDivElement) {
    this.rootElement = document.createElement('div');
    this.rootElement.id = 'country-stats';
    this.rootElement.classList.add('hidden');

    this.nameElement = document.createElement('h1');

    this.populationElement = document.createElement('span');
    this.infectedElement = document.createElement('span');
    this.immuneElement = document.createElement('span');
    this.deceasedElement = document.createElement('span');

    this.rootElement.appendChild(this.nameElement);
    this.rootElement.appendChild(this.populationElement);
    this.rootElement.appendChild(this.infectedElement);
    this.rootElement.appendChild(this.immuneElement);
    this.rootElement.appendChild(this.deceasedElement);
    container.appendChild(this.rootElement);
  }

  public open() {
    this.rootElement.classList.remove('hidden');
  }

  public close() {
    this.rootElement.classList.add('hidden')
  }

  public setCountry(country: Country) {
    if (this.subscription) {
      this.subscription();
    }

    this.subscription = country.onPopulationChanged(payload => {
      this.populationElement.innerText = payload.population.toString();
      this.deceasedElement.innerText = payload.noOfDeceased.toString();
    });
    this.nameElement.innerText = country.name;
    this.populationElement.innerText = country.currentPopulation.toString();
    this.infectedElement.innerText = country.infected.toString();
    this.immuneElement.innerText = country.immune.toString();
    this.deceasedElement.innerText = country.deceased.toString();
  }
}