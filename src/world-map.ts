import { Map as OpenLayerMap, View } from "ol";
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import {defaults as defaultControls} from 'ol/control';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';

import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { Subject, Observer, Subscription } from "./subject";

let selectedId: string | number | undefined;

const countryStyle = new Style({
  stroke: new Stroke({
    color: 'gray',
    width: 1
  }),
  fill: new Fill({
    color: 'rgba(20,20,20,0.9)'
  })
});

const selectedCountryStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(200,20,20,0.8)',
    width: 2
  }),
  fill: new Fill({
    color: 'rgba(200,20,20,0.4)'
  })
});

interface CountryChanged {
  id: string;
}

export class WorldMap {
  private worldLayer: VectorTileLayer;
  private selectedCountryLayer: VectorTileLayer;
  private openLayerMap: OpenLayerMap;
  private subject: Subject<CountryChanged>;

  constructor(worldSource: VectorTileSource) {
    this.subject = new Subject();
    this.worldLayer = new VectorTileLayer({
      declutter: true,
      source: worldSource,
      style: countryStyle
    });

    this.selectedCountryLayer = new VectorTileLayer({
      renderMode: 'vector',
      source: worldSource,
      style: function(feature) {
        if (feature.getId() === selectedId) {
          return selectedCountryStyle;
        }
      }
    });

    this.openLayerMap = new OpenLayerMap({
      target: 'world-map',
      controls: defaultControls(),
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom()
      ]),
      layers: [
        this.worldLayer,
        this.selectedCountryLayer
      ],
      view: new View({
        center: [0, 0],
        zoom: 0,
      })
    });

    this.openLayerMap.on('click', async (event) => {
      const features = await this.openLayerMap.getFeaturesAtPixel(event.pixel);
      if (!features.length) {
        selectedId = undefined;
        this.subject.notify({id: ''});
        this.selectedCountryLayer.changed();
        return;
      }

      const feature = features[0];
      if (selectedId === feature.getId()) {
        selectedId = undefined;
      } else {
        selectedId = feature.getId();
      }
      this.selectedCountryLayer.changed();
      this.subject.notify({id: selectedId?.toString() || ''});
    });
  }

  public onCountryChanged(observer: Observer<CountryChanged>): Subscription {
    return this.subject.attach(observer);
  }
}