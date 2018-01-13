enum Sex { MAN, WOMAN, MIDDLE, NONE }

export class PersonFilter {
	start: number;
	length: number;
	sex: Sex;
	age: {start: number, end: number};
}

export interface UserInfo {
	uid: number;
	first_name: string;
	last_name: string;
	photo_50: string;
	photo_200: string;
	sex: number;
	bdate: string;
}
export class PersonInfo {
	id: number = null;
	firstName: string = null;
	lastName: string = null;
	photo: {50: string, 200: string} = null;
	sex: Sex;
	bdate: Date = null;
	get fullName(){ return `${this.firstName} ${this.lastName}`; }
	copy(info: UserInfo) {
		if (info.first_name) { this.firstName = info.first_name; }
		if (info.last_name) { this.lastName = info.last_name; }
		if (info.sex) { this.sex = info.sex; }
		if (info.photo_50 && info.photo_200) {
			this.photo = {50: info.photo_50, 200: info.photo_200};
		}
	}
}

export class Person extends PersonInfo {
	friends: Person[] = [];
	constructor(
		public id: number,
	) {
		super();
	}
	setFriend(friends: Person[]) {
		this.friends = friends;
	}
	get frinedApiURL(){
		return `https://api.vk.com/method/friends.get?user_id=${this.id}&callback=JSONP_CALLBACK`;
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
	getAll(filter: PersonFilter = null) {
		if (filter) {
			let filtredList = this.list.filter( person => {
				if (filter.sex && filter.sex != person.sex) {
					console.log('filtred sex!!');
					return false;
				}
				return true;
			});
			if (filter.start || filter.length) {
				filtredList = filtredList.slice(
					filter.start ? filter.start : 0,
					filter.length ? filter.length : this.list.length);
			}
			return filtredList;
		}
		return this.list;
	}
}
