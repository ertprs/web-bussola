import { UserService } from './../user/user.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

export const ROUTES: RouteInfo[] = [
	{
		path: '/indicadores',
		title: 'Indicadores',
		icon: 'fal fa-analytics',
		class: '',
		permissonLevelNeeded: 2
	},
	{
		path: '/variables/organization',
		title: 'Parâmetros da contabilidade',
		icon: 'fal fa-th-list',
		class: '',
		permissonLevelNeeded: 1
	},
	{
		path: '/variables/company',
		title: 'Parâmetros dos clientes',
		icon: 'fal fa-th-list',
		class: '',
		permissonLevelNeeded: 1
	}
];

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
	menuItems: RouteInfo[];
	profileUrl: string;
	avatarUrl?: string;
	accountingLogoUrl?: string;
	userPermissionLevel: number;

	@ViewChild('drawer', { static: false }) drawer: ElementRef<MatSidenav>;

	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(map(result => result.matches));

	constructor(
		private breakpointObserver: BreakpointObserver,
		private userService: UserService
	) {}

	ngOnInit() {
		this.avatarUrl = this.userService.currentUserValue.avatar;
		this.accountingLogoUrl = this.userService.currentUserValue.organization.avatar;
		this.userPermissionLevel = this.userService.currentUserValue.type;
		this.profileUrl =
			AppComponent.apiOauthService +
			'/usuarios/' +
			this.userService.currentUserValue.id;
		this.menuItems = ROUTES.filter(menuItem => menuItem);
	}
}

export interface RouteInfo {
	path: string;
	title: string;
	icon: string;
	class: string;
	permissonLevelNeeded: number;
}
