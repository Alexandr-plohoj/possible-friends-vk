enum Sex { ANY, WOMAN, MAN }
enum Relation { NOT_SPECIFIED, SINGLE, IN_RELATIONSHIP, ENGAGED,
	MARRIED, COMPLICATED, SEARCHING, LOVE, CIVIL_UNION }
export class PersonFilter {
	start: number;
	length: number;
	sex = Sex.ANY;
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

export interface UserInfo {
	id: number;
	first_name: string;
	last_name: string;
	photo_100: string;
	photo_200_orig: string;
	sex: number;
	bdate: string;
	relation: Relation;
	city?: {id: number, title: string};
}

export class Person {
	firstName: string = null;
	lastName: string = null;
	photo: {100: string, 200: string} = null;
	sex: Sex = null;
	bdate: {day: number, month: number, year?: number} = null;
	relation: Relation;
	city: string;
	constructor(
		public id: number,
	) {}
	get age() {
		return new Date(
			Date.now() - new Date(this.bdate.year, this.bdate.month, this.bdate.day).getTime()
		).getFullYear() - 1970;
	}
	static get version() {return '&v=5.71'; }
	static get field() {
		return '&fields=first_name,last_name,sex,bdate,photo_100,photo_200_orig,relation,city';
	}
	static friendApiURL(id: number) {
		return `https://api.vk.com/method/friends.get?user_id=${id}${Person.field}${Person.version}&callback=JSONP_CALLBACK`;
	}
	get friendIDsApiURL() {
		return `https://api.vk.com/method/friends.get?user_id=${this.id}${Person.version}&callback=JSONP_CALLBACK`;
	}
	get infoApiURL() {
		return `https://api.vk.com/method/users.get?user_id=${this.id}${Person.field}${Person.version}&callback=JSONP_CALLBACK`;
	}
	get fullName(){ return `${this.firstName} ${this.lastName}`; }
	copy(info: UserInfo) {
		this.firstName = info.first_name;
		this.lastName = info.last_name;
		this.sex = info.sex;
		if (info.photo_100 || info.photo_200_orig) {
			this.photo = {
				100: info.photo_100 ? info.photo_100 : null,
				200: info.photo_200_orig ? info.photo_200_orig : null,
			};
		}
		if (info.bdate) {
			let date = info.bdate.split('.');
			if (date.length == 2) {
				this.bdate = {day: parseInt(date[0], null), month: parseInt(date[1], null)};
			} else if (date.length == 3) {
				this.bdate = {
					day: parseInt(date[0], null),
					month: parseInt(date[1], null),
					year: parseInt(date[2], null),
				};
			} else {
				console.log('strange date', info.bdate);
			}
		}
		this.relation = info.relation;
		if (info.city) {this.city = info.city.title; }
		return this;
	}
}

export class PersonCount extends Person {
	constructor(
		public id: number,
		public count = 0,
	) {
		super(id);
	}
}

export class FriendPerson extends Person {
	friendList = new Array<Person>();
}

export class PersonCountList {
	public friendList = new Array<FriendPerson>();
	public list = new Array<PersonCount>();
	get(id: number) {
		let person = this.list.find(value => value.id == id);
		if (person) {
			return person;
		}
		person = new PersonCount(id);
		this.list.push(person);
		return person;
	}
	sort() {
		this.list = this.list.sort((a, b) => {
			if ( a.count < b.count) {
				return 1;
			}
			if ( a.count > b.count) {
				return -1;
			}
			return 0;
		});
	}
	getAll(filter: PersonFilter = null, trim = true) {
		if (filter) {
			let filtredList = this.list.filter( person => {
				if (filter.sex && filter.sex != person.sex) {return false; }
				if (filter.age.start || filter.age.end) {
					if (person.bdate && person.bdate.year) {
						let age = person.age;
						if (filter.age.start && filter.age.start > age) {return false; }
						if (filter.age.end && filter.age.end < age) {return false; }
					} else if (!filter.age.showWithout) {return false; }
				}
				if (filter.relation.value) {
					if (person.relation) {
						if (filter.relation.value != person.relation) {return false; }
					} else if (!filter.relation.showWithout) {return false; }
				}
				if (filter.city.value.length) {
					if (person.city) {
						if (!filter.city.value.some(filterCity => person.city.includes(filterCity))) {
							return false;
						}
					} else if (!filter.city.showWithout) {
						return false;
					}
				}
				if (filter.friends.length) {
					let isCommonFriend = filter.friends.some( friendID => {
						let friend = this.friendList.find(value => value.id == friendID.id);
						if (!friend) {
							console.warn('Friend not found');
							return false;
						}
						return friend.friendList.some(value => value.id == person.id);
					});
					if (!isCommonFriend) {return false; }
				}
				return true;
			});
			if (trim && (filter.start || filter.length)) {
				filtredList = filtredList.slice(
					filter.start ? filter.start : 0,
					filter.length ? filter.length : this.list.length);
			}
			return filtredList;
		}
		return this.list;
	}
}
