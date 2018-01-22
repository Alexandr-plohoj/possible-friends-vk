import { Component, OnInit } from '@angular/core';
import { PersonStorageService, LoadingStage } from '../../servises/person.storage.service';
import { Person } from '../../models/person/person.model';
import { PersonCountList } from '../../servises/person.count.list.service';
import { PersonFilter } from '../../models/person/person.filter.model';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	person: Person = null;
	possibleFrinedList: PersonCountList;
	loadingStage: LoadingStage;
	filter = new PersonFilter();
	userID: number;
	constructor(
		private personStorageService: PersonStorageService,
	) {}
	ngOnInit() {}
	get possibleFrinedFiltredList() {
		return this.possibleFrinedList.getAll(this.filter);
	}
	get posibleFriendsFilterLengthWithoutTrim() {
		return this.possibleFrinedList.getAll(this.filter, false).length;
	}
	get hintFriendList() {
		if (!this.possibleFrinedList) {return []; }
		return this.possibleFrinedList.friendList.map(friend => {
			return {id: friend.id, value: friend.fullName};
		});
	}
	loadPosibleFriend() {
		delete this.possibleFrinedList;
		delete this.loadingStage;
		this.filter.length = 10;
		if (!this.userID) {return; }
		(this.person && this.person.id == this.userID ?
			Promise.resolve(this.person) :
			this.personStorageService.get(this.userID)
				.then((person) => {
					this.person = person;
					return person;
			})
		).then( person => {
			this.personStorageService.getPossibleFriends(this.person)
			.subscribe((value) => {
				if (value instanceof PersonCountList) {
					this.possibleFrinedList = value;
					delete this.loadingStage;
				} else if (value instanceof LoadingStage) {
					this.loadingStage = value;
				}
			});
		});
	}
	changeUser() {
		if (this.userID) {
			this.personStorageService.get(this.userID)
			.then((person) => {
				this.person = person;
			});
		}
	}
	changeFilter() {
		console.log(this.filter);
	}
	showMore() {
		this.filter.length += 10;
	}
}
