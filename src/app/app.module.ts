import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder } from '@angular/forms';
import { TranslatorModule } from 'angular-translator';

import { RelationPipe } from './servises/pipes/relation.pipe';

import { AppComponent } from './app.component';
import { SearchComponent } from './pages/search/search.component';
import { PersonStorageService } from './servises/person.storage.service';
import { ConnectionBackend, HttpModule,  Http,  Jsonp,  JsonpModule } from '@angular/http';
import { PersonComponent } from './pages/search/person/person.component';

@NgModule({
	declarations: [
		AppComponent,
		SearchComponent,
		PersonComponent,
		RelationPipe,
	],
	imports: [
		BrowserModule,
		JsonpModule,
		FormsModule,
		TranslatorModule.forRoot({
			providedLanguages: ['en', 'ru'],
			defaultLanguage: 'en',
			detectLanguage: true,
		}),
	],
	providers: [
		PersonStorageService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
