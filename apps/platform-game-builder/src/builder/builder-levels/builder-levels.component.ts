import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BuilderComponentStore } from '../builder.component.store';

@Component({
  selector: 'pgb-builder-levels',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let level of levels$ | async; index as i"
         (click)="selectLevel(i)"
         class="level">L{{i + 1}}</div>
    <div class="level" (click)="addLevel()">+</div>
  `,
  styleUrls: ['./builder-levels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderLevelsComponent {
  builderStore = inject(BuilderComponentStore);

  levels$ = this.builderStore.levels$;

  selectLevel(index: number) {
    this.builderStore.setSelectedLevelIndex(index);
  }

  addLevel(): void {
    this.builderStore.addLevel();
  }
}
