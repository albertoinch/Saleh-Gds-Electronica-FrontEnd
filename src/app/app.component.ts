import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {
    this.colorLoading = '#6610f2';
    this.grosorLoading = '6px';
    this.diametroIconoLoading = '26px';
  }
  // Barra loading
  public colorLoading: any;
  public grosorLoading: any;
  public diametroIconoLoading: any;

  ngOnInit() {}
}
