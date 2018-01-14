import { Component, OnInit } from '@angular/core';
import { PersonStorageService, LoadingStage } from '../../servises/person.storage.service';
import { Person, PersonCount, PersonCountList, PersonFilter } from '../../servises/person';

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
	fromModel = {
		userID: undefined as number,
	};
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
	loadPosibleFriend() {
		delete this.possibleFrinedList;
		delete this.loadingStage;
		this.filter.length = 10;
		(this.person && this.person.id == this.fromModel.userID ?
			Promise.resolve(this.person) :
			this.personStorageService.get(this.fromModel.userID)
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
		this.personStorageService.get(this.fromModel.userID)
		.then((person) => {
			this.person = person;
		});
	}
	changeFilter() {
		console.log(this.fromModel, this.filter);
	}
	showMore() {
		this.filter.length += 10;
	}

}
