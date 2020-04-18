import { WorldMap } from "./world-map";
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { Feature } from "ol";
import { Country } from "./model/country";
import { CountryStatisticsView } from "./view/country-statistics-view";
import { Calendar } from "./model/calendar";
import { CalendarView } from "./view/calendar-view";
import { Game } from "./model/game";

var worldSource = new VectorTileSource({
  maxZoom: 15,
  format: new MVT({
    idProperty: 'iso_a3'
  }),
  url: 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
});

export class App {
  private running = false;
  private worldMap: WorldMap;
  private calendar: Calendar;
  private game: Game;

  private countryStatistics: CountryStatisticsView;
  private calendarView: CalendarView;

  constructor() {
    
    this.worldMap = new WorldMap(worldSource);
    this.worldMap.onCountryChanged((payload) => {
      this.game.onCountrySelected(payload.id);

      if (!this.game.selectedCountry) {
        this.countryStatistics.close();
        return;
      }
      this.countryStatistics.setCountry(this.game.selectedCountry);
      this.countryStatistics.open();
    });
    this.calendar = new Calendar();
    this.game = new Game(worldSource, this.calendar);

    const appElement = document.getElementById('app') as HTMLDivElement;

    this.countryStatistics = new CountryStatisticsView(appElement);
    this.calendarView = new CalendarView(appElement);
  }

  /*const timeToHappen = 1600;

  onDayChanged() {
    const chance = Math.random() * 200;
    accumulatedChance += chance;
    if (currentTime >= this.timeToHappen) {
      doTheDo();
    }
  }*/

  start() {
    this.running = true;
    const updateFunc = () => {
      this.calendar.tick(10 * 60 * 1000);
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

