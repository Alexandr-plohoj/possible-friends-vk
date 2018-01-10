import { Injectable } from '@angular/core';
import { error } from 'util';
declare var personStorageService: PersonStorageService;
export class Person {
	friends = new Array<number>();
	script: HTMLElement = null;
	constructor( public id: number) {}
	addFriend(response: {response?: number[], error: {}}) {
		if (response.error) {
			return;
		}
		this.friends = response.response;
		console.log(this);
	}
	loadFriends() {
		this.script = document.createElement('SCRIPT');
		this.script['src'] = `https://api.vk.com/method/friends.get?user_id=${this.id}&callback=personStorageService.get(${this.id}).addFriend`;
		console.log(this.script['src']);
		document.getElementsByTagName('head')[0].appendChild(this.script);
	}
}

@Injectable()
export class PersonStorageService {
	storage = new Map<number, Person>();
	constructor() {
		personStorageService = this;
	}
	get(id: number){
		if (this.storage.has(id)) {
			return this.storage.get(id);
		} else {
			let person = new Person(id);
			this.storage.set(id, person);
			return person;
		}
	}
}
