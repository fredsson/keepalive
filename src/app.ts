import { Map, View } from "ol";
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import {defaults as defaultControls} from 'ol/control';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

var country = new Style({
  stroke: new Stroke({
    color: 'gray',
    width: 1
  }),
  fill: new Fill({
    color: 'rgba(20,20,20,0.9)'
  })
});
var vtLayer = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    maxZoom: 15,
    format: new MVT({
      idProperty: 'iso_a3'
    }),
    url: 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
      'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
  }),
  style: country
});

export class App {
  public map?: Map;

  public sayHay() {
    this.map = new Map({
      target: 'basicMap',
      controls: defaultControls(),
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
      ]),
      layers: [
        vtLayer
      ],
      view: new View({
        center: [0, 0],
        zoom: 0,
      })
    })
    console.log('hay');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.sayHay();
});

