import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WebSocketService} from './web-socket.service';
import {WebSocketSubject} from 'rxjs/webSocket';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isStart = false;
  isView = false;
  waitingQueue = [];
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
          duration: 60000,
          refresh: 1000,
          delay: 2000,
        }
      }],
      yAxes: [{
        ticks: {
          min: 50
        }
      }]
    },
    plugins: {
      streaming: {            // per-chart option
        frameRate: 30       // chart is drawn 30 times every second
      }
    },
    maintainAspectRatio: false,
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
            max: 150,
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

  subject: WebSocketSubject<unknown>;

  constructor(private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {

    const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 1000);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    this.barConfig.datasets[0].backgroundColor = gradient;

    // this.test();
    this.prod();
  }

  prod() {
    this.subject = this.webSocketService.serve();
    this.subject.subscribe((res: MessageEvent) => {
      this.isStart = true;
      const score = parseFloat(res.data);
      if (score > 0) {
        this.isView = true;
      } else {
        this.waitingQueue.push(1);
        if (this.waitingQueue.length > 20) {
          this.waitingQueue = [];
        }
      }
      this.datasets[0].data.push({
        x: new Date(),
        y: score
      });
      const intScore = Math.round(score);
      this.barConfig.datasets[0].data = [intScore];
      this.heartRateScore = intScore;
    });
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
