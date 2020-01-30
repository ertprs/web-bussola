import { User } from '@app/models/User';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { VariableInfo } from '@shared/models/variables';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VariableService {
	constructor(
		private httpClient: HttpClient,
		private authService: AuthenticationService
	) {}

	requestScriptType() {
		return this.httpClient.get(
			`${environment.appApi}/script_type?accounting=${123}`,
			{
				headers: this.authService.getAuthorizationHeaders()
			}
		);
	}
	// requestScriptType() {
	// 	return this.httpClient.get(
	// 		`${environment.appApi}/script_type?accounting=${
	// 			User.fromLocalStorage().organization.id
	// 		}`,
	// 		{
	// 			headers: this.authService.getAuthorizationHeaders()
	// 		}
	// 	);
	// }

	requestOrganizationVariables() {
		return this.httpClient.get(
			`${environment.appApi}/variables/byOrganization/${
				User.fromLocalStorage().organization.id
			}`,
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}

	requestCompanyVariables(companyId: number) {
		return this.httpClient.get(
			`${environment.appApi}/variables/organization/byCompany/${companyId}`,
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}

	requestMissingVariables(companyId: number) {
		return this.httpClient.get(
			`${environment.appApi}/variables/organization/missing/${companyId}`,
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}

	postVariable(variableInfo: VariableInfo, companyId?: number) {
		return this.httpClient.post(
			`${environment.appApi}/variables/organization`,
			{
				id: variableInfo.id,
				organizationId: variableInfo.organizationId || companyId,
				variableId: variableInfo.variableId,
				accountingCode: variableInfo.accountingCode,
				originValue: variableInfo.originValue,
				absoluteValue: variableInfo.absoluteValue
			},
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}

	postOrganizationVariable(variableInfo: VariableInfo) {
		return this.httpClient.post(
			`${environment.appApi}/variables`,
			{
				id: variableInfo.id,
				organizationId: User.fromLocalStorage().organization.id,
				accountingCode: variableInfo.accountingCode
			},
			{ headers: this.authService.getAuthorizationHeaders() }
		);
	}
}
