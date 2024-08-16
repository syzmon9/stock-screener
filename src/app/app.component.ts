import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from "./table/table.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FilterComponent } from './filter/filter.component';
import { AppState, selectFilters } from './state/crypto/crypto.selectors';
import { Store } from '@ngrx/store';
import * as CryptoActions from './state/crypto/crypto.actions';
import * as CryptoSelectors from './state/crypto/crypto.selectors';
import * as ApplicationStateActions from './state/application/application.actions';
import { FilterCriteria } from './models/filterCryteria';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ColDef, GetRowIdParams, RowClickedEvent } from 'ag-grid-community';
import { AsyncPipe } from '@angular/common';
import { Crypto } from './models/crypto';
import { ApiService } from './services/api.service';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartComponent } from "./chart/chart.component";
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, TableComponent, MatButtonModule, FilterComponent, AsyncPipe, ChartComponent, MatExpansionModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
    @HostListener('window:resize', ['$event.target.innerWidth'])
    onResize(windowWidth: number) {
        this.store.dispatch(ApplicationStateActions.setScreen({ windowWidth }));
    }
    @ViewChild(MatExpansionPanel, {static: true}) matExpansionPanelElement: MatExpansionPanel | undefined;

    columnDefinitions: Observable<ColDef[]> | undefined;
    defaultColumnDefinition: Observable<ColDef> | undefined;
    rowData$: Observable<Crypto[]> | undefined;
    chartData$: Observable<ChartData> | undefined;
    chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    tooltipFormat: 'MMM d, h:mm a',
                },
            },
        },
    };

    private filterCriteria: FilterCriteria | undefined;

    private readonly dialog = inject(MatDialog);
    private readonly store = inject(Store<AppState>);
    private readonly apiService = inject(ApiService);
    private readonly destroy$ = new Subject<void>();


    ngOnInit(): void {
        this.store.dispatch(ApplicationStateActions.setScreen({ windowWidth: window.innerWidth }));
        this.store.dispatch(CryptoActions.loadCryptos());

        this.store.select(selectFilters).pipe(
            takeUntil(this.destroy$)
        ).subscribe(filters => {
            this.filterCriteria = filters;
        });

        this.rowData$ = this.store.select(CryptoSelectors.selectFilteredCryptos);
        this.columnDefinitions = this.store.select(CryptoSelectors.selectColumnDefinitions);
        this.defaultColumnDefinition = this.store.select(CryptoSelectors.selectDefaultColumnDefinition);
    }

    getRowId = (params: GetRowIdParams<Crypto>) => params.data.symbol;

    openFilters(event: Event): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(FilterComponent, {
            data: { ...this.filterCriteria },
        });

        dialogRef.afterClosed().pipe(
            takeUntil(this.destroy$)
        ).subscribe(result => {
            if (result !== undefined) {
                this.store.dispatch(CryptoActions.clearFilters());
                this.store.dispatch(CryptoActions.updateFilters({ filters: result }))
            }
        });
    }

    onRowClicked(event: RowClickedEvent<Crypto>): void {
        if (event.data) {
            const symbol = event.data.symbol;
            this.chartData$ = this.apiService.getLastPriceHistory(symbol).pipe(
                map((data) => {
                    return {
                        labels: data.map((entry: any) => new Date(entry.time)),
                        datasets: [
                            {
                                label: `${symbol} Price`,
                                data: data.map((entry: any) => entry.price),
                                borderColor: 'rgba(75,192,192,1)',
                                backgroundColor: 'rgba(75,192,192,0.2)',
                                fill: true,
                                tension: 0.1,
                            },
                        ],
                      };
                })
            );
            this.matExpansionPanelElement?.open();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
