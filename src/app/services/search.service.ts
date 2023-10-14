import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  choices = new Subject<any[]>();
  selection = new Subject<any>();

  constructor() { }


  searchLocation(location: string) {
    fetch('https://nominatim.openstreetmap.org/search?q=' + location + '&format=json&polygon=1&addressdetails=1')
    .then(response => response.json())
    .then(data => {
      let choices: any[] = [];
      data.forEach((element: any) => {
        choices.push(element);
      });
      this.choices.next(choices);
    }); 
  }


  selectChoice(choice: any) {
    this.selection.next(choice);
  }
}
