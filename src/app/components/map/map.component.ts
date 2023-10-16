import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Observable, Subscription } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {

  iconRed = L.icon({
    iconUrl: 'assets/img/marker_red.png',
    iconSize: [28, 34],
    iconAnchor: [28, 34],
    popupAnchor: [-14, -34]
  });

  iconBlue = L.icon({
    iconUrl: 'assets/img/marker_blue.png',
    iconSize: [28, 34],
    iconAnchor: [28, 34],
    popupAnchor: [-14, -34]
  });

  private map!: L.Map;

  private initMap(): void {
    let lat = 49.878708;
    let lon = 8.646927;
    let zoom = 13;
    this.map = L.map('map').setView([lat, lon], zoom);
    let center = this.map.getCenter();

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    });

    tiles.addTo(this.map);
  }

  previousMarker: L.Marker = L.marker([0, 0]);
  userMarker: L.Marker = L.marker([0, 0]);

  sub: Subscription = new Subscription();


  constructor(private searchService: SearchService) { }


  ngOnInit() {

  }


  ngAfterViewInit(): void {
    this.initMap();
    // Arrow function needed to keep the scope of 'this' inside the function.
    // It will correctly point to the component instance.
    this.map.on('click', (e) => this.onMapClick(e));

    this.sub = this.searchService.selection.subscribe((location: any) => {
      if (location.lat == 0 && location.lon == 0) return;
      this.previousMarker.remove();
      this.previousMarker = L.marker([location.lat, location.lon], { icon: this.iconRed }).addTo(this.map).bindPopup(location.display_name + " (" + location.type + ")").openPopup();
      this.map.setView([location.lat, location.lon], 13);
      //window.open('https://www.google.com/maps/search/Burg/@' + location.lat + ',' + location.lon + ",13.00z?entry=ttu");
    });
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
    this.map.clearAllEventListeners();
    this.map.remove();
  }


  onMapClick(e: L.LeafletMouseEvent) {
    this.userMarker.remove();
    this.userMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon: this.iconBlue }).addTo(this.map).bindPopup('What is here? ' + e.latlng.toString()).openPopup();
    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + e.latlng.lat + '&lon=' + e.latlng.lng).then(response => response.json()).then(data => {
      console.log(data);
      this.userMarker.bindPopup(data.display_name).openPopup();
    });
    // Open link in new tab
    //window.open('https://www.google.com/maps/search/Spielplatz/@' + e.latlng.lat + ',' + e.latlng.lng + ",13.00z?entry=ttu");
  }


}
