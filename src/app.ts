import { WorldMap } from "./world-map";
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { CountryStatisticsView } from "./view/country-statistics-view";
import { Calendar } from "./model/calendar";
import { CalendarView } from "./view/calendar-view";
import { Game } from "./model/game";
import { ActionView } from "./view/action-view";

import './styles/styles.scss';
import { PlayerView } from "./view/player-view";

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
  private actionView: ActionView;
  private playerView: PlayerView;

  constructor() {
    this.worldMap = new WorldMap(worldSource);
    this.worldMap.onCountryChanged((payload) => {
      this.game.onCountrySelected(payload.id);
    });
    this.calendar = new Calendar();
    this.game = new Game(worldSource, this.calendar);

    const appElement = document.getElementById('app') as HTMLDivElement;

    this.countryStatistics = new CountryStatisticsView(appElement, this.game);
    this.calendarView = new CalendarView(appElement);
    this.actionView = new ActionView(appElement, this.game, {sendResearchTeamCommand: () => this.game.addResearchTeam()});
    this.playerView = new PlayerView(appElement, this.game.playerSubject);
  }

  public start() {
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

  public pause() {
    this.running = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.start();
});

