import {Component} from '@angular/core';
import {RestService} from './rest.service';
import {MessagingService} from './messaging.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'app';

	/**
	 *
	 */
	constructor(
		private rest: RestService,
		private messageServiec: MessagingService
	) {
		this.rest.getSessions().subscribe((x) => {
			console.log(x);
		});
	}
}
