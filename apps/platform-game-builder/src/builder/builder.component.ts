import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { LetModule } from '@ngrx/component';
import { provideComponentStore } from '@ngrx/component-store';
import { combineLatest, map, skipWhile } from 'rxjs';
import { ELEMENTS_MAP } from '../../../platform-game/src/config/elements-map';
import { Vec } from '../../../platform-game/src/utils/vec';
import { BuilderLevelsComponent } from './builder-levels/builder-levels.component';
import { BuilderPreviewComponent } from './builder-preview/builder-preview.component';
import { BuilderComponentStore } from './builder.component.store';
import { GameElementCoordinates } from './builder.types';

@Component({
  selector: 'pgb-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HttpClientModule, BuilderLevelsComponent, BuilderPreviewComponent, LetModule],
  providers: [provideComponentStore(BuilderComponentStore)],
  template: `
    <ng-container *ngrxLet="showPreview$ | async as showPreview">
      <button (click)="togglePreview()"
              class="togglePreviewBtn">{{showPreview ? 'Builder' : 'Preview'}}
      </button>
      <ng-container *ngIf="!showPreview">
        <div class="controlPanel">
          <pgb-builder-levels></pgb-builder-levels>
          <div class="availableElements">
            <div *ngFor="let element of availableElements"
                 (click)="selectElement(element)"
                 [class.selected]="(selectedElement$ | async) === element"
                 class="element {{elementClassListMap[element.key]}}">{{element.key}}</div>
          </div>
          <div class="actionButtons">
            <button (click)="saveLevels()"
                    class="actionBtn">Save
            </button>
          </div>
        </div>
        <div class="levelGrid">
          <div *ngFor="let row of elementsGrid$ | async; index as y"
               class="elementRow">
            <div *ngFor="let element of row; index as x"
                 (click)="replaceElementWithSelected({x, y})"
                 class="elementCell">
              <div class="elementView {{elementClassListMap[element]}}"></div>
            </div>
          </div>
        </div>
      </ng-container>
      <pgb-builder-preview *ngIf="showPreview" class="preview"></pgb-builder-preview>
    </ng-container>
  `,
  styleUrls: ['builder.component.scss']
})
export class Builder implements OnInit {
  store = inject(BuilderComponentStore);

  elementClassListMap: Record<string, string> = {};
  availableElements = Object.entries(ELEMENTS_MAP).map(
    //@ts-ignore
    ([key, value]) => ({...value, key})
  )
  levels$ = this.store.levels$;
  selectedElement$ = this.store.selectedElement$;
  showPreview$ = this.store.showPreview$;

  private static EMPTY_ELEMENT_TYPE = 'empty';
  private selectedLevelIndex$ = this.store.selectedLevelIndex$;

  elementsGrid$ = combineLatest(this.levels$, this.selectedLevelIndex$).pipe(
    skipWhile(([levels]) => levels.length === 0),
    //@ts-ignore
    map(([levels, selectedLevel]) => levels[selectedLevel].map((row: string) => ([...row]))),
  );

  constructor() {}

  async ngOnInit() {
    this.store.loadLevels();
    this.fillElementsClassListMap();
  }

  async saveLevels() {
    this.store.saveLevels();
  }

  async togglePreview() {
    this.store.togglePreview();
  }

  fillElementsClassListMap() {
    for (const key in ELEMENTS_MAP) {
      let elementClassList = '';

      //@ts-ignore
      const { type, modifiers } = ELEMENTS_MAP[key];

      if (type === Builder.EMPTY_ELEMENT_TYPE) {
        this.elementClassListMap[key] = elementClassList;
        continue;
      }

      if (typeof type === 'string') {
        elementClassList = type;
      } else {
        const actor = type.create(new Vec(0, 0));
        elementClassList = actor.type;
      }

      if (Array.isArray(modifiers) && modifiers.length) {
        const modifiersClasses = modifiers.map(modifier => modifier);
        elementClassList = [elementClassList, ...modifiersClasses].join(' ');
      }

      this.elementClassListMap[key] = elementClassList;
    }
  }

  selectElement(element: any) {
    this.store.setSelectedElement(element);
  }

  replaceElementWithSelected(coordinates: GameElementCoordinates) {
    this.store.replaceElementWithSelected(coordinates);
  }
}
