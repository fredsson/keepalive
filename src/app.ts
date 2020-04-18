import { Map, View } from "ol";
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import {defaults as defaultControls} from 'ol/control';
export class App {
  public map?: Map;

  public sayHay() {
    this.map = new Map({
      target: 'basicMap',
      controls: defaultControls(),
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
      ]),
      /*interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
      ]),*/
      /*interactions: defaultInteractions().extend([
        new PointerInteraction({
          handleDownEvent: (p0) => {
            console.log('woo');

            return true;
          },
          handleEvent: (p0) => {
            console.log('owowowowowo', p0.coordinate);
            return true;
          }
        })
      ]),
      controls: defaultControls({zoom: true, rotate: false}).extend([
        new ZoomToExtent({
          extent: [
            813079.7791264898, 5929220.284081122,
            848966.9639063801, 5936863.986909639
          ]
        })
      ])*/
      layers: [
        new TileLayer({
          source: new OSM()
        })
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

