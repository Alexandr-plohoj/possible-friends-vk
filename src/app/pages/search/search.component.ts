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
	get possibleFrinedFiltredList() {return this.possibleFrinedList.getAll(this.filter); }
	loadPosibleFriend() {
		delete this.possibleFrinedList;
		delete this.loadingStage;
		this.filter = new PersonFilter();
		this.filter.length = 10;
		this.personStorageService.get(this.fromModel.userID)
		.then((person) => {
			this.person = person;
			this.personStorageService.loadInfo([this.person]);
			this.personStorageService.getPossibleFriends(this.person)
			.subscribe((value) => {
				if (value instanceof PersonCountList) {
					this.possibleFrinedList = value;
					this.personStorageService.loadInfo(this.possibleFrinedList.getAll(this.filter));
					delete this.loadingStage;
				} else if (value instanceof LoadingStage) {
					this.loadingStage = value;
				}
			});
		});
	}
	changeUser() {
		this.personStorageService.loadInfo([new Person(this.fromModel.userID)])
		.then((person) => {
			this.person = person[0];
		});
	}
	ngOnInit() {}
}
