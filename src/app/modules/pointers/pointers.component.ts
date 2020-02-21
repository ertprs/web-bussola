import { User } from '@app/models/User';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Company } from '@shared/models/company';
import { Profit } from '@shared/models/profit';
import { FormatedKpi, Kpi } from '@shared/models/kpi';
import { KpiService } from '@shared/services/kpi.service';
import { KpiDetail } from '@shared/models/kpi-detail';
import { AnnotationsComponent } from '@shared/components/annotations/annotations.component';
import { Observable, Subject, timer } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, debounce, debounceTime, delay } from 'rxjs/operators';

@Component({
	selector: 'app-pointers',
	templateUrl: './pointers.component.html',
	styleUrls: ['./pointers.component.scss']
})
export class PointersComponent {
	selectedCompany: Company;

	kpis: FormatedKpi[] = [];
	isLoading = true;

	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(map(result => result.matches));

	constructor(
		private breakpointObserver: BreakpointObserver,
		private kpiService: KpiService,
		private dialog: MatDialog
	) {}

	requestKpis() {
		this.isLoading = true;
		this.kpis = [];

		this.kpiService.getKpis(this.selectedCompany.cnpj).subscribe(
			(response: any) => {
				response.content.forEach((kpi: Kpi, index: number) => {
					const formatedKpi: FormatedKpi = {
						id: kpi.id,
						kpiAlias: kpi.kpiAlias,
						title: kpi.title,
						chartType: kpi.chartType
							.replace('Donut', 'Pie')
							.replace('Multiple', '')
							.replace('Stacked', ''),
						labelArray: kpi.labelArray,
						chartOptions: JSON.parse(kpi.chartOptions),
						roles: [],
						data: [],
						index
					};

					this.kpiService
						.getKpiDetails(kpi.id)
						.subscribe((details: any) => {
							details.content.forEach((detail: KpiDetail) => {
								formatedKpi.data.push(
									this.kpiService.formatKpiDetail(detail)
								);
							});

							formatedKpi.labelArray.forEach(
								(currentValue, i) => {
									formatedKpi.roles.push({
										role: 'tooltip',
										type: 'string',
										index: i + 1
									});
								}
							);
							formatedKpi.labelArray.splice(0, 0, 'Month');

							this.kpis.push(formatedKpi);
							this.kpis.sort((a, b) => {
								if (a.index > b.index) {
									return 1;
								}
								if (a.index < b.index) {
									return -1;
								}
								return 0;
							});
							this.isLoading = false;
						});
				});
			},
			err => {
				console.log(err);
			},
			() =>
				setTimeout(() => {
					this.isLoading = false;
				}, 7000)
		);
	}

	onCompanyChanged(selectedCompany: Company) {
		this.selectedCompany = selectedCompany;
		if (!!selectedCompany) this.requestKpis();
	}

	openModal(kpiAlias: string) {
		this.dialog.open(AnnotationsComponent, {
			width: '33rem',
			data: { externalId: this.selectedCompany.externalId, kpiAlias }
		});
	}
}
