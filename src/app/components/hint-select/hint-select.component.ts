import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';

interface Hint {
	id: number;
	value: string;
}

@Component({
	selector: 'app-hint-select',
	templateUrl: './hint-select.component.html',
	styleUrls: ['./hint-select.component.css']
})
export class HintSelectComponent implements OnInit {
	inputText: string;
	visible = false;
	@Input() title: string;
	@Input() hintList = new Array<Hint>();
	filtredHintList = new Array<Hint>();
	@Input() selectList = new Array<Hint>();
	constructor(private eRef: ElementRef) {}
	ngOnInit() {}
	add(item: Hint) {
		console.log('add');
		this.visible = false;
		if (this.selectList.some(value => value.id == item.id)) {
			return;
		}
		this.selectList.push(item);
		this.inputText = undefined;
	}
	delete(item: Hint) {
		this.selectList.splice(
			this.selectList.findIndex(value => value.id == item.id),
			1
		);
	}
	updateHint(text) {
		if (text) {
			this.filtredHintList = this.hintList.filter(value =>
				value.value.toUpperCase().includes(text.toUpperCase())
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
