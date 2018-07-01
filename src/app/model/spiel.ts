import {Spieler} from './spieler';

export interface Spiel {
	spielID: string;
	gameState?: any;
	currentRoundIndex: number;
	anzahlSpieler: number;
	maxRundenZahl: number;
	startPlayer: number;
	ruleIndex: number;
	currentRule?: any;
	decisionRuleIndex: number;
	currentDecisionRule?: any;
	currentDecisionAnnouncement?: any;
	decisionAnnouncements: any[];
	validCard: boolean;
	currentSpieler: Spieler;
	currentSpielerName: String;
	spieler: String[];
}
