import { Component, OnInit } from '@angular/core';
import { PersonStorageService, LoadingStage } from '../../servises/person.storage.service';
import { Person, PersonCount, PersonCountList } from '../../servises/person';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	person: Person = null;
	possibleFrinedList = new PersonCountList();
	loadingStage = new LoadingStage();
	constructor(private personStorageService: PersonStorageService) {
		this.personStorageService.get(293423171)
		.then((person) => {
			this.person = person;
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

	ngOnInit() {}
}
