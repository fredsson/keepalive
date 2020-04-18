import { WorldMap } from "./world-map";
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { Feature } from "ol";
import { Country } from "./country";
import { CountryStatisticsView } from "./view/country-statistics-view";

var worldSource = new VectorTileSource({
  maxZoom: 15,
  format: new MVT({
    idProperty: 'iso_a3'
  }),
  url: 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
});

export class App {
  private countries: Map<string, Country> = new Map();
  private worldMap: WorldMap;

  private countryStatistics: CountryStatisticsView;

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
    this.countryStatistics = new CountryStatisticsView(document.getElementById('app') as HTMLDivElement);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});

