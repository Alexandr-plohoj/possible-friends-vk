import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { error } from 'util';
import { Person, PersonCount, PersonCountList } from './person';
import { Subject } from 'rxjs/Subject';

export class LoadingStage {
	succesfull = 0;
	failed = 0;
	resultCount = 0;
	constructor (
		public length = 0,
	) {}
	get total() {
		return this.succesfull + this.failed;
	}
	get persent(){
		if (this.length == 0) {
			return 0;
		}
		return Math.floor(100 / this.length * this.total);
	}
}

@Injectable()
export class PersonStorageService {
	constructor(private jsonp: Jsonp) {
	}
	get(id: number) {
		return new Promise<Person>((resolver, reject) => {
			let person = new Person(id);
			this.jsonp.get(person.infoURL).toPromise().then((response) => {
				if (response.json().error) {
					reject(response.json().error);
				}
				let possibleFriendList = new Array<Person>();
				for (let friendID of response.json().response as number[]) {
					possibleFriendList.push(new Person(friendID));
				}
				person.setFriend(possibleFriendList);
				resolver(person);
			});
		});
	}
	getPossibleFriends(person: Person) {
		let subject = new Subject<LoadingStage| PersonCountList>();
		let possibleFriendList = new PersonCountList();
		let loadingStage = new LoadingStage(person.friends.length);
		for (let friend of person.friends) {
			this.jsonp.get(friend.infoURL).toPromise()
			.then((response) => {
				if (response.json().error) {
					loadingStage.failed++;
					return;
				}
				for (let possibleFriendID of response.json().response as number[]) {
					if (person.id != possibleFriendID
							&& !person.friends.some( personFrineds => personFrineds.id == possibleFriendID)) {
						possibleFriendList.get(possibleFriendID).count++;
					}
				}
				loadingStage.succesfull++;
				loadingStage.resultCount = possibleFriendList.list.length;
				subject.next(loadingStage);
				if (loadingStage.total >= person.friends.length) {
					possibleFriendList.sort();
					subject.next(possibleFriendList);
					subject.complete();
				}
			}).catch(() => {
				loadingStage.failed++;
				subject.next(loadingStage);
				if (loadingStage.total >= person.friends.length) {
					possibleFriendList.sort();
					subject.next(possibleFriendList);
					subject.complete();
				}
			});
		}
		return subject;
	}
}
