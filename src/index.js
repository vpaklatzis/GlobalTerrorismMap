import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { ScatterplotLayer } from '@deck.gl/layers'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import mapStyles from './map-styles.js';

const scatterplot = () => new ScatterplotLayer({
    id: 'scatter',
    data: './globalterrorismdb.json',
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 2,
    radiusMaxPixels: 5,
    getPosition: d => [(d.longitude), (d.latitude)],
    getFillColor: d => d.killed > 0 ? [200, 0 , 40, 150] : [255, 140 ,0 ,100],
    visible: true,
    pickable: true,

    onHover: ({object, x, y}) => {
        const el = document.getElementById('tooltip');
        if (object) {
            const { year, month, day, city, target, attacktype,weapontype, killed, wounded } = object;
            el.innerHTML = `<p>${month}/${day}/${year}<br>City: ${city}<br>Target: ${target}<br>Attack: ${attacktype}<br>Weapon: ${weapontype}<br>Killed: ${killed}<br>Wounded: ${wounded}</p>`;
            el.style.display = 'block';
            el.style.opacity = 0.8;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        } else {
            el.style.opacity = 0.0;
        }
    },
});

const heatmap = () => new HeatmapLayer ({
    id: 'heat',
    data: './globalterrorismdb.json',
    getPosition: d => [(d.longitude), (d.latitude)],
    getWeight: d => (d.killed * 10) + (d.wounded * 5),
    visible: true,
    radiusPixels: 60
});

const hexagon = () => new HexagonLayer ({
    id: 'hex',
    data: './globalterrorismdb.json',
    getPosition: d => [(d.longitude), (d.latitude)],
    getElevationWeight: d => (d.killed * 100)+ (d.wounded * 50),
    visible: true,
    elevationScale: 5000,
    extruded: true,
    radius: 3000,
    opacity: 0.8,
    coverage: 1,
    lowerPercentile: 30
});

window.initMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 25.0, lng: 0.0},
        zoom: 3.2,
        styles: mapStyles
    });

    const overlay = new GoogleMapsOverlay({
        layers: [
            scatterplot(),
            heatmap(),
            hexagon()
        ]
    });

    overlay.setMap(map);
}