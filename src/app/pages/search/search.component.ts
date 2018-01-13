import { Component, OnInit } from '@angular/core';
import { PersonStorageService } from '../../servises/person.storage.service';
import { Person, PersonCount, PersonCountList } from '../../servises/person';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	person: Person = null;
	possibleFrinedList = new PersonCountList();
	constructor(private personStorageService: PersonStorageService) {
		this.personStorageService.get(293423171)
		.then((person) => {
			this.person = person;
			return this.personStorageService.getPossibleFriends(this.person);
		})
		.then((possibleFrinedList) => {
			this.possibleFrinedList = possibleFrinedList;
		});
	}

	ngOnInit() {}
}
