import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams, RowClickedEvent } from 'ag-grid-community';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [AgGridModule, AsyncPipe],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> {

    @Input() colDefs: ColDef[] = [];
    @Input() defaultColDef: ColDef | undefined;
    @Input() rowData: T[] = [];
    @Input() getRowId: GetRowIdFunc = (params: GetRowIdParams<any>) => params.data.id;

    @Output() onRowClicked = new EventEmitter<RowClickedEvent>();

    onCryptoClick(event: RowClickedEvent) {
        this.onRowClicked.emit(event);
    }
}
