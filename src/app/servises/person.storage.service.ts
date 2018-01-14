import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { error } from 'util';
import { Person, PersonCount, PersonCountList, UserInfo } from './person';
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
		this.jsonp.get(person.friendIDsApiURL).toPromise().then(response => {
			if (response.json().error) {
				subject.error(response.json().error);
				return;
			}
			return response.json().response.items as number[];
		})
		.then( friendIDs => {
			let loadingStage = new LoadingStage(friendIDs.length);
			for (let friendID of friendIDs) {
				this.jsonp.get(Person.friendApiURL(friendID)).toPromise()
				.then((response) => {
					if (response.json().error) {
						loadingStage.failed++;
						return;
					}
					for (let possibleFriendInfo of response.json().response.items as UserInfo[]) {
						// let possibleFriendID = response.json().response[0] as number;
						if (person.id != possibleFriendInfo.id
								&& !friendIDs.some( personFrineds => personFrineds == possibleFriendInfo.id)) {
							let possibleFriend = possibleFriendList.get(possibleFriendInfo.id);
							possibleFriend.count++;
							possibleFriend.copy(possibleFriendInfo);
						}
					}
					loadingStage.succesfull++;
					loadingStage.resultCount = possibleFriendList.list.length;
					subject.next(loadingStage);
					if (loadingStage.total >= friendIDs.length) {
						possibleFriendList.sort();
						subject.next(possibleFriendList);
						subject.complete();
					}
				}).catch(() => {
					loadingStage.failed++;
					subject.next(loadingStage);
					if (loadingStage.total >= friendIDs.length) {
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
