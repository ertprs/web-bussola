import { User } from './../models/User';
import { AuthenticationService } from './../../core/authentication/authentication.service';
import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnnotationService {
	constructor(
		private http: HttpClient,
		private authService: AuthenticationService
	) {}

	getAnnotations(externalId: string, kpiAlias: string) {
		return this.http.get(
			`${environment.appApi}/annotations?organizationId=${externalId}&kpiAlias=${kpiAlias}`,
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}

	postAnnotation(externalId: string, kpiAlias: string, description: string) {
		return this.http.post(
			`${environment.appApi}/annotations`,
			{
				organizationId: externalId,
				createdBy: User.fromLocalStorage().username, // PODERIA SER ID AO INVÉS DE USERNAME
				kpiAlias,
				description
			},
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}

	deleteAnnotation(id: number) {
		return this.http.delete(`${environment.appApi}/annotations/${id}`, {
			headers: this.authService.getAuthorizationHeaders()
		});
	}

	patchAnnotation(annotation: any) {
		return this.http
			.patch(
				`${environment.appApi}/annotations/${annotation.id}`,
				annotation,
				{
					headers: this.authService.getAuthorizationHeaders()
				}
			)
			.pipe(debounceTime(10000));
	}
}
