export class Person {
	friends: Person[] = [];
	constructor(
		public id: number,
	) {}
	setFriend(friends: Person[]) {
		this.friends = friends;
	}
	get infoURL(){
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

class Loaded {
	succesfull = 0;
	failed = 0;
	get total() {
		return this.succesfull + this.failed;
	}
}

export class PersonCountList {
	public list = new Array<PersonCount>();
	public friendInfoLoaded = new Loaded;
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
}
