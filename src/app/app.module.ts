import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { SearchComponent } from "./pages/search/search.component";
import { PersonStorageService } from "./servises/person.storage.service";

@NgModule({
	declarations: [AppComponent, SearchComponent],
	imports: [BrowserModule],
	providers: [PersonStorageService],
	bootstrap: [AppComponent]
})
export class AppModule {}
