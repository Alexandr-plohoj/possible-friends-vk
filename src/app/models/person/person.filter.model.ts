import { Relation } from './relation.model';
import { Gender } from './gender.model';
import { PersonFriend } from './person.friend.model';
import { PersonCount } from './person.count.model';

export class PersonFilter {
	start: number;
	length: number;
	sex = Gender.ANY;
	age = {start: null as number, end: null as number, showWithout: false};
	relation = {values: new Array<{value: Relation}>(), showWithout: false};
	city = {value: new Array<string>(), showWithout: false};
	friends = {values: new Array<{value: PersonFriend}>(), allSelectedFriends: false};
	hide = new Array<PersonCount>();
	clone() {
		let filter = new PersonFilter();
		filter.start = this.start;
		filter.length = this.length;
		filter.sex = this.sex;
		if (filter.age) {
			filter.age = {start: this.age.start, end: this.age.end, showWithout: this.age.showWithout};
		}
		filter.relation = {values: this.relation.values.slice(), showWithout: this.relation.showWithout};
		filter.city = {value: this.city.value, showWithout: this.city.showWithout};
		filter.friends = {values: this.friends.values.slice(), allSelectedFriends: this.friends.allSelectedFriends};
		return filter;
	}
}
