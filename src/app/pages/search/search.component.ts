import { Component, OnInit } from '@angular/core';
import { PersonStorageService, Person } from '../../servises/person.storage.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	person: Person;
	constructor(private personStorageService: PersonStorageService) {
		this.person = this.personStorageService.get(293423171);
	}

	ngOnInit() {}
}
