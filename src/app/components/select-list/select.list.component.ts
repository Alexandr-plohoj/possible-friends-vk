import { Component, OnInit, Input } from '@angular/core';

interface Hint {
	value: any;
	title: string;
}

@Component({
	selector: 'app-select-list',
	templateUrl: './select.list.component.html',
	styleUrls: ['./select.list.component.css']
})
export class SelectListComponent implements OnInit {
	select: Hint;
	inputText: string;
	@Input() title: string;
	@Input() selectList = new Array<Hint>();
	@Input() hintList = new Array<Hint>();
	filtredhintList = new Array<Hint>();
	constructor() {}
	ngOnInit() {
		this.filtredhintList = this.hintList.slice();
	}
	add(item: Hint) {
		this.selectList.push(item);
		setTimeout(() =>this.select = undefined, 0);
		this.filtredhintList.splice(this.filtredhintList.indexOf(item), 1);
	}
	delete(item: Hint) {
		this.selectList.splice(this.selectList.indexOf(item), 1);
		this.filtredhintList.push(item);
	}
}
