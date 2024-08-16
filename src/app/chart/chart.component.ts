import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartData, CategoryScale, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

Chart.register(CategoryScale);

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {
    @Input() chartOptions: ChartOptions | undefined;
    @Input() chartData: ChartData = { datasets: [] };
}
