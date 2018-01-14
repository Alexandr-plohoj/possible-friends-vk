enum Sex { NONE = 0, WOMAN = 1, MAN = 2 }

export class PersonFilter {
	start: number;
	length: number;
	sex: Sex;
	age = {start: null as number, end: null as number};
	showWithoutAge = false;
	clone() {
		let filter = new PersonFilter();
		filter.start = this.start;
		filter.length = this.length;
		filter.sex = this.sex;
		if (filter.age) {
			filter.age = {start: this.age.start, end: this.age.end};
		}
		filter.showWithoutAge = this.showWithoutAge;
		return filter;
	}
}

export interface UserInfo {
	uid: number;
	first_name: string;
	last_name: string;
	photo_100: string;
	photo_200: string;
	sex: number;
	bdate: string;
}

export class Person {
	firstName: string = null;
	lastName: string = null;
	photo: {100: string, 200: string} = null;
	sex: Sex = null;
	bdate: {day: number, month: number, year?: number} = null;
	constructor(
		public id: number,
	) {}
	static get field() {
		return '&fields=first_name,last_name,sex,bdate,photo_100,photo_200';
	}
	static friendApiURL(id: number) {
		return `https://api.vk.com/method/friends.get?user_id=${id}${Person.field}&callback=JSONP_CALLBACK`;
	}
	get friendIDsApiURL() {
		return `https://api.vk.com/method/friends.get?user_id=${this.id}&callback=JSONP_CALLBACK`;
	}
	get infoApiURL() {
		return `https://api.vk.com/method/users.get?user_id=${this.id}${Person.field}&callback=JSONP_CALLBACK`;
	}
	get fullName(){ return `${this.firstName} ${this.lastName}`; }
	copy(info: UserInfo) {
		if (info.first_name) { this.firstName = info.first_name; }
		if (info.last_name) { this.lastName = info.last_name; }
		if (info.sex) { this.sex = info.sex; }
		if (info.photo_100 && info.photo_200) {
			this.photo = {100: info.photo_100, 200: info.photo_200};
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

export class PersonCountList {
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
				if (filter.sex && filter.sex != person.sex) {
					return false;
				}
				if (filter.age.start || filter.age.end) {
					if (person.bdate && person.bdate.year) {
						let bdate = new Date(person.bdate.year, person.bdate.month, person.bdate.day).getTime();
						if (filter.age.start) {
							if (Date.now() - (filter.age.start * 31536000000) < bdate) {
								return false;
							}
						}
						if (filter.age.end) {
							if (Date.now() - (filter.age.end * 31536000000) > bdate) {
								return false;
							}
						}
					} else if (!filter.showWithoutAge) {
						return false;
					}
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
