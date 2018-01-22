import { Jsonp } from '@angular/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Person } from '../models/person/person.model';
import { PersonCountList } from './person.count.list.service';
import { PersonFriend } from '../models/person/person.friend.model';
import { PersonCount } from '../models/person/person.count.model';
import { UserDTO } from '../models/person/user.dto.model';

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
		let clock = Date.now();
		let subject = new Subject<LoadingStage| PersonCountList>();
		let friendList = new Map<number, PersonFriend>();
		let possibleFriendList = new Map<number, PersonCount>();
		this.jsonp.get(Person.friendApiURL(person.id)).toPromise()
		.then(response => {
			if (response.json().error) {
				subject.error(response.json().error);
				return;
			}
			return response.json().response.items as Array<UserDTO>;
		})
		.then( friendDTOList => {
			friendDTOList.forEach(friendDTO => {
				friendList.set(friendDTO.id, new PersonFriend(friendDTO.id).copy(friendDTO));
			});
			let loadingStage = new LoadingStage(friendDTOList.length);
			friendList.forEach(friend => {
				this.jsonp.get(Person.friendApiURL(friend.id)).toPromise()
				.then((response) => {
					if (response.json().error) {
						loadingStage.failed++;
						return;
					}
					let possibleFriendDTOList = response.json().response.items as UserDTO[];
					for (let possibleFriendDTO of possibleFriendDTOList) {
						if (person.id != possibleFriendDTO.id
								&& !friendList.has(possibleFriendDTO.id)) {
							let possibleFriend = possibleFriendList.get(possibleFriendDTO.id);
							if (!possibleFriend) {
								possibleFriend = new PersonCount(possibleFriendDTO.id).copy(possibleFriendDTO);
								possibleFriendList.set(possibleFriend.id, possibleFriend);
							}
							possibleFriend.friendList.push(friend);
							possibleFriend.count++;
							friend.friendList.push(possibleFriend);
						}
					}
					loadingStage.succesfull++;
					loadingStage.resultCount = possibleFriendDTOList.length;
				}).catch(() => loadingStage.failed++)
				.then(() => {
					subject.next(loadingStage);
					if (loadingStage.total >= friendDTOList.length) {
						let personCountList = new PersonCountList(
							Array.from(friendList.values()),
							Array.from(possibleFriendList.values()),
						);
						personCountList.sortPossibleFriendlist();
						subject.next(personCountList);
						subject.complete();
						console.log('time:', Date.now() - clock);
					}
				});
			});
		});
		return subject;
	}
}
