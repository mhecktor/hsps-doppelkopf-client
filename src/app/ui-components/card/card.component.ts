import {Component, OnInit, Input} from '@angular/core';
import {Card} from '../../model/card';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {RestService} from '../../rest.service';
import {Subject} from 'rxjs';
import {Message} from '../../model/mqtt-message';

@Component({
	selector: 'card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
	onUnsubscribe = new Subject();

	@Input() public card: Card;
	@Input() public atTurn: boolean;

	playerName: String;
	gameId: String;

	constructor(private route: ActivatedRoute, private rest: RestService) {
		this.route.params.subscribe((params) => {
			if (params && params.playerName) {
				this.playerName = params.playerName;
				this.gameId = params.id;
			}
		});
	}

	ngOnInit() {}

	playCard() {
		if (this.atTurn) {
			this.rest
				.playCard(this.gameId, this.playerName, this.card)
				.pipe(takeUntil(this.onUnsubscribe))
				.subscribe(
					(data) => {
						console.log(data);
					},
					(error) => {
						console.log(error);
						if(error.error.message === 'Karte nicht gueltig') {
							alert('Karte ungültig')
						}
					}
				);
		} else {
			say("Flossen weg, du bist nicht dran!")
		}
	}

	ngOnDestroy(): void {
		this.onUnsubscribe.next();
		this.onUnsubscribe.complete();
	}
}
let voices: SpeechSynthesisVoice[] = [];
window.speechSynthesis.onvoiceschanged = function() {
    voices = window.speechSynthesis.getVoices();
};

export function say(text: string) {
	var synth = window.speechSynthesis;
	if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (text !== '') {
	var utterThis = new SpeechSynthesisUtterance(text);
	console.log(synth.getVoices());
	voices.forEach((x) => {
		if(x.name === 'Anna') {
			utterThis.voice = x;
		}
	})

	// https://github.com/mdn/web-speech-api/blob/master/speak-easy-synthesis/script.js   
    synth.speak(utterThis);
  }
}