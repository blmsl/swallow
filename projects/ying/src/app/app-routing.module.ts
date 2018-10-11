import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		loadChildren: "./pages/login/login.module#LoginModule"
	},
	{
		// to be removed after finalizing user login / signup function
		path: "home",
		loadChildren: "./pages/home/home.module#HomeModule"
	},
	{
		path: "forums",
		loadChildren: "./pages/forums/forums.module#ForumsModule"
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
