import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';

interface Hint {
	value: any;
	title: string;
}

@Component({
	selector: 'app-pick-list',
	templateUrl: './pick.list.component.html',
	styleUrls: ['./pick.list.component.css']
})
export class PickListComponent implements OnInit {
	inputText: string;
	visible = false;
	@Input() title: string;
	@Input() hintList = new Array<Hint>();
	filtredHintList = new Array<Hint>();
	@Input() selectList = new Array<Hint>();
	constructor(private eRef: ElementRef) {}
	ngOnInit() {}
	add(item: Hint) {
		this.visible = false;
		if (this.selectList.some(value => value == item)) {
			return;
		}
		this.selectList.push(item);
		this.inputText = undefined;
	}
	delete(item: Hint) {
		this.selectList.splice(
			this.selectList.findIndex(value => value == item),
			1
		);
	}
	updateHint(text) {
		if (text) {
			this.filtredHintList = this.hintList.filter(value =>
				value.title.toUpperCase().includes(text.toUpperCase())
			);
		} else {
			this.filtredHintList = this.hintList;
		}
		this.visible = true;
	}
	closeHint() {
		this.visible = false;
	}
	@HostListener('document:click', ['$event'])
	clickout(event) {
		if (!this.eRef.nativeElement.contains(event.target)) {
			this.closeHint();
		}
	}
}
