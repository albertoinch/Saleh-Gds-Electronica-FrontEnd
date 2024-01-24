import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent implements OnInit {
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  constructor() {}
  // Gráfico Bar
  public graficosBarOpciones: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public graficosBarEtiquetas: string[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012'
  ];
  public graficosBarTipo: string;
  public graficosBarLeyenda: boolean;

  public graficosBar: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: '.COM.BO' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: '.BO' }
  ];
  // Gráfico Doughnut
  public graficosDonasEtiquetas: string[] = ['.COM.BO', '.BO', '.GOB.BO'];
  public graficosDonas: number[] = [350, 450, 100];
  public graficosDonasTipo: string;

  // Gráfico Pie
  public graficosPieEtiquetas: string[] = ['.BO', '.COM.BO', '.GOB.BO'];
  public graficosPie: number[] = [300, 500, 100];
  public graficosPieTipo: string;

  // lineChart
  public graficosLine: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: '2017' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: '2018' },
    { data: [18, 48, 77, 9, 100, 27, 40], label: '2019' }
  ];
  public graficosLineEtiquetas: Array<any> = [
    '.BO',
    '.COM.BO',
    '.GOB.BO',
    '.EDU.BO',
    '.BOLIVIA.BO',
    '.BLOG.BO',
    '.WEB.BO'
  ];
  public graficosLineOpciones: any = {
    responsive: true
  };
  public graficosLineColores: Array<any> = [
    {
      // lila
      backgroundColor: 'rgba(110,67,191,0.2)',
      borderColor: 'rgba(110,67,191,1)',
      pointBackgroundColor: 'rgba(110,67,191,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(110,67,191,0.8)'
    },
    {
      // Verde
      backgroundColor: 'rgba(32,199,149,0.2)',
      borderColor: 'rgba(32,199,149,1)',
      pointBackgroundColor: 'rgba(32,199,149,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(32,199,149,1)'
    },
    {
      // Azul
      backgroundColor: 'rgba(0,123,255,0.2)',
      borderColor: 'rgba(0,123,255,1)',
      pointBackgroundColor: 'rgba(0,123,255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,123,255,0.8)'
    }
  ];
  public graficosLineLeyenda: boolean;
  public graficosLineTipo: string;

  // events
  public graficosClick(e: any): void {
    // console.log(e);
  }

  public graficoHover(e: any): void {
    // console.log(e);
  }

  public datosAleatoriosBar(): void {
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.random() * 100,
      56,
      Math.random() * 100,
      40
    ];
    const clone = JSON.parse(JSON.stringify(this.graficosBar));
    clone[0].data = data;
    this.graficosBar = clone;
  }
  ngOnInit() {
    this.graficosBarTipo = 'bar';
    this.graficosBarLeyenda = true;
    this.graficosDonasTipo = 'doughnut';
    this.graficosPieTipo = 'pie';
    this.graficosLineLeyenda = true;
    this.graficosLineTipo = 'line';
  }
}
