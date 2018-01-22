import { Person } from './person.model';

export class PersonFriend extends Person {
	friendList = new Array<Person>();
}
