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


export class PersonCountList {
	private list = new Array<PersonCount>();
	get(id: number) {
		let person = this.list.find(value => value.id == id);
		if (person) {
			return person;
		}
		person = new PersonCount(id);
		this.list.push(person);
		return person;
	}
	getList(sorted = true) {
		if (sorted) {
			return this.list.sort((a, b) => {
				if ( a.count < b.count) {
					return 1;
				}
				if ( a.count > b.count) {
					return -1;
				}
				return 0;
			});
		}
		return this.list;
	}
}
