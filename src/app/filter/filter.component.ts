import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterCriteria } from '../models/filterCryteria';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CommonModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {
    constructor(
        public dialogRef: MatDialogRef<FilterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FilterCriteria
    ) {}

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
