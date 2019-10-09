import { LogoutComponent } from './auth/logout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './auth/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatSidenavModule,
	MatListModule,
	MatButtonModule,
	MatIconModule,
	MatToolbarModule,
	MatSnackBarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [LoginComponent, LogoutComponent, MenuComponent],
	imports: [
		CommonModule,
		RouterModule,
		LayoutModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		MatSidenavModule,
		MatToolbarModule,
		HttpClientModule,
		MatSnackBarModule
	],
	exports: [MenuComponent],
	providers: []
})
export class SharedModule {}
