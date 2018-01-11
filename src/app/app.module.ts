import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { SearchComponent } from "./pages/search/search.component";
import { PersonStorageService } from "./servises/person.storage.service";
import {ConnectionBackend, HttpModule,  Http,  Jsonp,  JsonpModule} from '@angular/http';

@NgModule({
	declarations: [
		AppComponent,
		SearchComponent,
	],
	imports: [
		BrowserModule,
		JsonpModule,
	],
	providers: [
		PersonStorageService,
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
