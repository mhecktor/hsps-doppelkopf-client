import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import { RestService } from '../../rest.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessagingService } from '../../messaging.service';

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit, OnChanges, OnDestroy {
  onUnsubscribe = new Subject();
	players: String[] = [];  
  @Input() id: string = '';
  
  constructor(private rest: RestService,
  private mqtt: MessagingService) { }
  
  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.onUnsubscribe.next();
    this.onUnsubscribe.complete();
  }

  ngOnChanges() {
    if(this.id !== '') {
      this.loadSession();
      this.mqtt
      .subscribeToTopic(`/${this.id}/playerJoined`)
      .pipe(takeUntil(this.onUnsubscribe))
      .subscribe(() => {
        this.loadSession();
      })
    }
  }

  public loadSession() {
    this.rest.getSession(this.id)
      .pipe(takeUntil(this.onUnsubscribe))
      .subscribe((spiel) => {
        this.players = spiel.spieler;
      });
  }

}
