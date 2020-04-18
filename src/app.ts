import { WorldMap } from "./world-map";
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { Feature } from "ol";
import { Country } from "./model/country";
import { CountryStatisticsView } from "./view/country-statistics-view";
import { Calendar } from "./model/calendar";
import { CalendarView } from "./view/calendar-view";

var worldSource = new VectorTileSource({
  maxZoom: 15,
  format: new MVT({
    idProperty: 'iso_a3'
  }),
  url: 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
});

export class App {
  private running = false;
  private countries: Map<string, Country> = new Map();
  private worldMap: WorldMap;
  private calendar: Calendar;

  private countryStatistics: CountryStatisticsView;
  private calendarView: CalendarView;

  constructor() {
    worldSource.on('tileloadend',(event) => {
      (event.tile as any).features_.forEach((feature: Feature<any>) => {
        const id = feature.getId();
        if (typeof id !== 'string') {
          return;
        }

        const countryProps = feature.getProperties();
        this.countries.set(id, new Country(id, countryProps.name, countryProps.pop_est));
      });
    });
    this.worldMap = new WorldMap(worldSource);
    this.worldMap.onCountryChanged((payload) => {
      const country = this.countries.get(payload.id);

      if (!country) {
        this.countryStatistics.close();
        return;
      }
      this.countryStatistics.setCountry(country);
      this.countryStatistics.open();
    });
    this.calendar = new Calendar();

    const appElement = document.getElementById('app') as HTMLDivElement;

    this.countryStatistics = new CountryStatisticsView(appElement);
    this.calendarView = new CalendarView(appElement);

  }

  start() {
    this.running = true;
    const updateFunc = () => {
      this.calendar.tick(21 * 1000);
      this.calendarView.onCalendarUpdated(this.calendar.currentDate);
      window.requestAnimationFrame(updateFunc);
    }

    if (this.running) {
      window.requestAnimationFrame(updateFunc);
    }
  }

  pause() {
    this.running = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.start();
});

