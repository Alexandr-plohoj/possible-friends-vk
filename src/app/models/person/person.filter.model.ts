import { Relation } from './relation.model';
import { Gender } from './gender.model';

export class PersonFilter {
	start: number;
	length: number;
	sex = Gender.ANY;
	age = {start: null as number, end: null as number, showWithout: false};
	relation = {value: Relation.NOT_SPECIFIED, showWithout: false};
	city = {value: new Array<string>(), showWithout: false};
	friends = new Array<{id: number}>();
	clone() {
		let filter = new PersonFilter();
		filter.start = this.start;
		filter.length = this.length;
		filter.sex = this.sex;
		if (filter.age) {
			filter.age = {start: this.age.start, end: this.age.end, showWithout: this.age.showWithout};
		}
		filter.relation = {value: this.relation.value, showWithout: this.relation.showWithout};
		filter.city = {value: this.city.value, showWithout: this.city.showWithout};
		return filter;
	}
}
