import { Component, HostListener, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent {

  @ViewChild('location')
  location!: any;
  // Check if enter is pressed.
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.search();
  }

  constructor(public searchService: SearchService) { }


  search() {
    if (this.location.nativeElement.value != '') {
      this.searchService.searchLocation(this.location.nativeElement.value);
    }
  }


  selectChoice(choice: any) {
    this.searchService.selectChoice(choice);
    this.location.nativeElement.value = '';
    this.searchService.choices.next([]);
  }


}
