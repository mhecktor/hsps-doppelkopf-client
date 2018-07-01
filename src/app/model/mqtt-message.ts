export interface Message {
	topic: string;
	data: {
		type: string;
		data: any;
	}
}