import { Relation } from './relation.model';
import { UserDTO } from './user.dto.model';
import { Gender } from './gender.model';

export class Person {
	firstName: string = null;
	lastName: string = null;
	photo: {100: string, 200: string} = null;
	sex: Gender = null;
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
	copy(info: UserDTO) {
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
