import { Relation } from './relation.model';

export interface UserDTO {
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
