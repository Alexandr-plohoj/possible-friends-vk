import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { error } from 'util';
import { Person, PersonCount, PersonCountList, UserInfo, FriendPerson } from './person';
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
			this.jsonp.get(person.infoApiURL).toPromise().then((response: any) => {
				if (response.json().error) {
					reject(response.json().error);
					return;
				}
				person.copy(response.json().response[0]);
				resolver(person);
			}).catch((result) => reject(result));
		});
	}
	getPossibleFriends(person: Person) {
		let subject = new Subject<LoadingStage| PersonCountList>();
		let possibleFriendList = new PersonCountList();
		this.jsonp.get(Person.friendApiURL(person.id)).toPromise()
		.then(response => {
			if (response.json().error) {
				subject.error(response.json().error);
				return;
			}
			return response.json().response.items as Array<UserInfo>;
		})
		.then( friendList => {
			possibleFriendList.friendList = friendList.map(value => new FriendPerson(value.id).copy(value));
			let loadingStage = new LoadingStage(friendList.length);
			for (let friend of possibleFriendList.friendList) {
				this.jsonp.get(Person.friendApiURL(friend.id)).toPromise()
				.then((response) => {
					if (response.json().error) {
						loadingStage.failed++;
						return;
					}
					for (let possibleFriendInfo of response.json().response.items as UserInfo[]) {
						if (person.id != possibleFriendInfo.id
								&& !friendList.some( personFrined => personFrined.id == possibleFriendInfo.id)) {
							let possibleFriend = possibleFriendList.get(possibleFriendInfo.id);
							possibleFriend.count++;
							friend.friendList.push(possibleFriend);
							possibleFriend.copy(possibleFriendInfo);
						}
					}
					loadingStage.succesfull++;
					loadingStage.resultCount = possibleFriendList.list.length;
					subject.next(loadingStage);
					if (loadingStage.total >= friendList.length) {
						possibleFriendList.sort();
						subject.next(possibleFriendList);
						subject.complete();
					}
				}).catch(() => {
					loadingStage.failed++;
					subject.next(loadingStage);
					if (loadingStage.total >= friendList.length) {
						possibleFriendList.sort();
						subject.next(possibleFriendList);
						subject.complete();
					}
				});
			}
		});
		return subject;
	}
}
