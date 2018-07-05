import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Hand } from '../../model/hand';
import { ActivatedRoute, Params } from '@angular/router';
import { RestService } from '../../rest.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessagingService } from '../../messaging.service';

@Component({
  selector: 'player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss']
})
export class PlayerHandComponent implements OnInit {
  onUnsubscribe = new Subject();

  @Input() public hand: Hand;
  @Input() public name: String = '';
  @Input() public atTurn: boolean = false;
  public paramsPlayerName: String;
  public stichs: any;

  constructor(private route: ActivatedRoute,
    private rest: RestService,
    private mqtt: MessagingService) {
    this.route.params.subscribe((params) => {
      if (params && params.playerName) {
        this.loadStichs(params);
        this.paramsPlayerName = params.playerName;
        this.mqtt.subscribeToTopic(`/${params.id}/playerGotStich`)
          .pipe(takeUntil(this.onUnsubscribe))
          .subscribe((result) => {
            this.loadStichs(params);
          });
      }
    });
  }

  public loadStichs(params: Params) {
    this.rest.getStichs(params.id, params.playerName)
      .pipe(takeUntil(this.onUnsubscribe))
      .subscribe((res) => {
        this.stichs = res;
      });
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.onUnsubscribe.next();
    this.onUnsubscribe.complete();
  }

}
