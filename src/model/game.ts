import { Virus } from "./virus";
import { Calendar } from "./calendar";
import { AccumulatedRandom } from "../util/accumulated-random";
import { Country } from "./country";
import VectorTileSource from 'ol/source/VectorTile';
import { Feature } from "ol";
import { Player, PlayerReplaySubject } from "./player";
import { Subscription, Observer, ReplaySubject } from "../util/subject";

export interface SelectedCountryChangedPayload {
  country?: Country;
}

export interface CountrySubject {
  onSelectedCountryChanged(observer: Observer<SelectedCountryChangedPayload>): Subscription;
}

export class Game implements CountrySubject {
  private selectedCountrySubject = new ReplaySubject<SelectedCountryChangedPayload>();

  private countries: Map<string, Country> = new Map();
  private activeViruses: Virus[] = [];
  private virusOutbreakChance = new AccumulatedRandom(0.00007);
  private activeCountry: Country | undefined;
  private player: Player = new Player();

  constructor(worldSource: VectorTileSource, calendar: Calendar) {
    this.init(worldSource, calendar);
  }

  public onCountrySelected(countryId?: string) {
    this.activeCountry = countryId ? this.countries.get(countryId) : undefined;
    this.selectedCountrySubject.notify({country: this.activeCountry});
  }

  public get playerSubject(): PlayerReplaySubject {
    return this.player
  }

  public onSelectedCountryChanged(observer: Observer<SelectedCountryChangedPayload>): Subscription {
    return this.selectedCountrySubject.attach(observer);
  }

  private init(worldSource: VectorTileSource, calendar: Calendar) {
    calendar.onHourChanged(() => {
      this.rollForVirusOutbreak();
      this.countries.forEach(country => {
        country.update();
      });
    });

    worldSource.on('tileloadend',(event) => {
      (event.tile as any).features_.forEach((feature: Feature<any>) => {
        const id = feature.getId();
        if (typeof id !== 'string') {
          return;
        }

        if (this.countries.get(id)) {
          return;
        }

        const countryProps = feature.getProperties();
        this.countries.set(id, new Country(id, countryProps.name, countryProps.pop_est));
      });
    });
  }

  private rollForVirusOutbreak() {
    if (this.virusOutbreakChance.roll()) {
      const countryKeys = Array.from(this.countries.keys());
      const countryIndex = Math.round(Math.random() * (countryKeys.length - 1));
      const outbreakCountry = this.countries.get(countryKeys[countryIndex]);
      const virus = new Virus();

      outbreakCountry?.addVirus(virus);
      console.log('country', outbreakCountry?.name, 'was selected with mortality', virus.mortalityPerHour);
      this.activeViruses.push(virus);
    }
  }

}