import { PersonFriend } from './person.friend.model';

export class PersonCount extends PersonFriend {
	constructor(
		public id: number,
		public count = 0,
	) {
		super(id);
	}
}
