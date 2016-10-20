import { Component, OnInit } from '@angular/core';
import { DataService } from './shared/service/data.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dataService: DataService) {
  }

  public ngOnInit() {
  }
}
