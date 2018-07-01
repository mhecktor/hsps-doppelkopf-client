import {Hand} from './hand';
import {Statistik} from './statistic';

export interface Spieler {
	name: string;
	hand: Hand;
	statistik: Statistik;
	solo: boolean;
	gesammelteStiche: any[];
	chosenCard?: any;
	re: boolean;
	stichpunkte: number;
}
