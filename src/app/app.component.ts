import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  heartRateScore = 0;
  datasets: any[] = [
    {data: [], label: '心拍数', lineTension: 0.1},
  ];
  chartColor = [{
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: 'red',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];

  options: any = {
    scales: {
      xAxes: [{
        type: 'realtime',
        realtime: {
          duration: 20000,
          refresh: 1000,
          delay: 500,
        }
      }],
      yAxes: []
    },
    plugins: {
      streaming: {            // per-chart option
        frameRate: 30       // chart is drawn 30 times every second
      }
    }
  };

  barConfig = {
    type: 'bar',
    label: [''],
    datasets: [{
      data: [200],
      label: null,
      backgroundColor: 'red',
    }],
    color: [],
    options: {
      scales: {
        yAxes: [{
          ticks: {
            max: 300,
            min: 50
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      }
    }
  };

  @ViewChild('chart', null) canvas;

  ngOnInit(): void {

    const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 1000);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    this.barConfig.datasets[0].backgroundColor = gradient;

    this.test();
  }

  test() {
    setInterval(() => {
      const data = this.datasets[0].data;
      const score = Math.random() * 250 + 50;
      this.heartRateScore = Math.round(score);
      data.push({
        x: new Date(),
        y: score
      });
      // console.log(data);
      this.barConfig.datasets[0].data = [score];
      // console.log(this.barConfig.datasets[0].data);
      this.datasets[0].data = data;
    }, 1000);
  }


}
