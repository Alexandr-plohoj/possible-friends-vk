import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Translator } from 'angular-translator';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor (
		private title: Title,
		private translate: Translator,
	) {
		this.translate.translate('POSIBLE_FRIENDS_VK').then( value => this.title.setTitle(value.toString()));
	}
}
