import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { error } from 'util';
import { Person, PersonCount, PersonCountList } from './person';

@Injectable()
export class PersonStorageService{
	constructor(private jsonp: Jsonp) {
	}
	get(id: number) {
		let person = new Person(id);
		this.jsonp.get(person.infoURL).toPromise().then((response) => {
			if (response.json().error) {
				return;
			}
			let personList = new Array<Person>();
			for (let friendID of response.json().response as number[]) {
				personList.push(new Person(friendID));
			}
			person.setFriend(personList);
		});
		return person;
	}
	getPossibleFriends(person: Person) {
		let personList = new PersonCountList();
		for (let friend of person.friends) {
			this.jsonp.get(friend.infoURL).toPromise().then((response) => {
				if (response.json().error) {
					return;
				}
				for (let possibleFriendID of response.json().response as number[]) {
					if (!person.friends.some( personFrineds => personFrineds.id == possibleFriendID)) {
						personList.get(possibleFriendID).count++;
					}
				}
			});
		}
		return personList;
	}
}
