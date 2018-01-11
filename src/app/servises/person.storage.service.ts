import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { error } from 'util';

export class Person {
	friends = new Array<number>();
	script: HTMLElement = null;
	constructor( public id: number) {}
	addFriend(friendIDs: number[]) {
		this.friends = friendIDs;
		console.log(this);
	}
	get infoURL(){
		return `https://api.vk.com/method/friends.get?user_id=${this.id}&callback=JSONP_CALLBACK`
	}
}

@Injectable()
export class PersonStorageService {
	storage = new Map<number, Person>();
	constructor(private jsonp: Jsonp) {}
	get(id: number) {
		if (this.storage.has(id)) {
			return this.storage.get(id);
		} else {
			let person = new Person(id);
			this.jsonp.get(person.infoURL).toPromise().then((response) => {
				if (response.json().error) {
					return;
				}
				person.addFriend(response.json().response as number[]);
			});
			this.storage.set(id, person);
			return person;
		}
	}
}
