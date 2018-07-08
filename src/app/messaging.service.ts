import { log } from 'util';
import {Injectable, OnDestroy} from '@angular/core';
import {MqttService} from 'ngx-mqtt';
import {takeUntil, map} from 'rxjs/operators';
import {Subject, Observable} from 'rxjs';
import {Message} from './model/mqtt-message';

@Injectable({
	providedIn: 'root',
})
export class MessagingService implements OnDestroy {
	onUnsubscribe = new Subject();

	constructor(private mqtt: MqttService) {
		this.mqtt.connect();
		console.log(this.mqtt);
		// this.mqtt
		// 	.observe('/+/playerJoined')
		// 	.pipe(takeUntil(this.onUnsubscribe))
		// 	.subscribe((res) => {
		// 		// console.log('Subscribed to: \'#\'', res.topic, JSON.parse(res.payload.toString()));
		// 		console.log(res);
		// 	});
	}

	public debugMessages() {
		const log = (method) =>  (x) => console.log(method, x);
		this.mqtt.onClose
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe(log("onClose"));
		this.mqtt.onConnect
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe(log("onConnect"));
		this.mqtt.onError
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe(log("onError"));
		this.mqtt.onMessage
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe(log("onMessage"));
		this.mqtt.onReconnect
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe(log("onReconnect"));
		this.mqtt.onSuback
			.pipe(takeUntil(this.onUnsubscribe))
			.subscribe(log("onSuback"));
	}

	// Show in DEMO
	subscribeToTopic(topic: string): Observable<Message> {
		MqttService.filterMatchesTopic(topic, '/Wurst/playerJoined')
		return this.mqtt
			.observe(topic)
			.pipe(map(result => {
				// console.log(topic, result);				
				return {
					topic: topic,
					data: JSON.parse(result.payload.toString())
				}
			}));
	}

	ngOnDestroy(): void {
		this.onUnsubscribe.next();
		this.onUnsubscribe.complete();
		this.mqtt.disconnect();
	}
}
