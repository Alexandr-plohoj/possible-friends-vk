import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'relation' })
export class RelationPipe implements PipeTransform {
	transform(value: number) {
		switch (value) {
			case 1: return 'SINGLE';
			case 2: return 'IN_RELATIONSHIP';
			case 3: return 'ENGAGED';
			case 4: return 'MARRIED';
			case 5: return 'COMPLICATED';
			case 6: return 'SEARCHING';
			case 7: return 'LOVE';
			case 8: return 'CIVIL_UNION';
		}
		return 'NOT_SPECIFIED';
	}
}
