import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, skipWhile, tap } from 'rxjs';
import { ELEMENTS_MAP } from '../../../../game/elements-map.js';
import { Vec } from '../../../../game/utils/vec.js';

@Component({
  selector: 'pgb-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="controlPanel">
      <div class="levels">
        <div *ngFor="let level of levels$ | async; index as i"
             (click)="selectLevel(i)"
             class="level" >L{{i + 1}}</div>
        <div class="level" (click)="addLevel()">+</div>
      </div>
      <div class="availableElements">
        <div *ngFor="let element of availableElements"
             (click)="selectElement(element)"
             class="element {{elementClassListMap[element.key]}}">{{element.key}}</div>
        <button (click)="saveChanges()"
                class="saveChanges">Save</button>
      </div>
    </div>
    <div class="levelGrid">
      <div *ngFor="let row of elementsGrid$ | async; index as y"
           class="elementRow">
        <div *ngFor="let element of row; index as x"
             (click)="replaceElementWithSelected(x, y)"
             class="elementCell">
          <div class="elementView {{elementClassListMap[element]}}"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      background-color: lightblue;
      height: 100vh;
    }
    .controlPanel {
      display: flex;
      justify-content: space-between;
      padding: 20px;
    }
    .levels {
      display: flex;
    }
    .availableElements {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .level,
    .element {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border: 1px solid;
      margin: 0 5px;
      cursor: pointer;
    }
    .level:hover {
      opacity: 0.5;
    }
    .element:hover{
      opacity: 0.5;
    }
    .saveChanges {
      cursor: pointer;
      padding: 20px 40px;
      margin-left: 40px;
    }
    .levelGrid {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: auto;
      padding-bottom: 10px;
    }
    .elementRow {
      display: flex;
    }
    .elementCell {
      position: relative;
      width: 27px;
      height: 27px;
      border: 0.5px solid lightblue;
      background-color: rgb(52, 166, 251);
      cursor: pointer;
    }
    .elementCell:hover {
      opacity: 0.5;
    }
    .elementView {
      width: 100%;
      height: 100%;
    }
    .welcome {
      margin: 2rem;
      font-size: 3rem;
      font-weight: 500;
      letter-spacing: -0.025em;
      line-height: 1;
      text-align: center;
    }
    .lava,
    .lava-mob {
      background: rgb(183, 65, 14);
    }
    .coin {
      background: rgb(241, 229, 89);
    }
    .water {
      background: aqua;
    }
    .player {
      background: rgb(64, 64, 64);
    }
    .exit {
      background: darkslategrey;
    }
    .wall {
      background: white;
    }
    .wall.invisible {
      opacity: 0.3;
    }
  `]
})
export class Builder implements OnInit {
  private static EMPTY_ELEMENT_TYPE = 'empty';
  private static LEVEL_WIDTH_IN_ELEMENTS = 80;
  private static LEVLE_HEIGHT_IN_ELEMENTS = 25;
  levels$ = new BehaviorSubject([]);
  elementClassListMap: Record<string, string> = {};

  readonly availableElements = Object.entries(ELEMENTS_MAP).map(
    //@ts-ignore
    ([key, value]) => ({...value, key})
  )

  private selectedLevelIndex$ = new BehaviorSubject(0);
  private selectedElement = this.availableElements[0];

  readonly elementsGrid$ = combineLatest(this.levels$, this.selectedLevelIndex$).pipe(
    skipWhile(([levels]) => levels.length === 0),
    tap(([levels]) => console.log(levels)),
    //@ts-ignore
    map(([levels, selectedLevel]) => levels[selectedLevel].map((row: string) => ([...row]))),
  );

  constructor() {}

  async ngOnInit() {
    this.fillElementsClassListMap();

    const res = await fetch('api/levels');
    const levels = await res.json();
    this.levels$.next(levels);
  }

  async saveChanges() {
    await fetch('api/levels', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.levels$.getValue())
    });
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

  selectLevel(index: number) {
    this.selectedLevelIndex$.next(index);
  }

  selectElement(element: any) {
    this.selectedElement = element;
  }

  replaceElementWithSelected(x: number, y: number) {
    const levels = [...this.levels$.getValue()];
    const selectedLevelIndex = this.selectedLevelIndex$.getValue();
    const selectedLevel = levels[selectedLevelIndex];
    //@ts-ignore
    selectedLevel[y] = replaceAt(selectedLevel[y], x, this.selectedElement.key);
    levels[selectedLevelIndex] = selectedLevel;
    this.levels$.next(levels);
  }

  addLevel(): void {
    const currentLevels = this.levels$.getValue();
    const [emptySymbolKey] = Object.entries(ELEMENTS_MAP).find(
      ([key, value]) => value.type === Builder.EMPTY_ELEMENT_TYPE
    )![0];
    const newLevel = new Array(Builder.LEVLE_HEIGHT_IN_ELEMENTS).fill(
      emptySymbolKey.repeat(Builder.LEVEL_WIDTH_IN_ELEMENTS)
    );
    //@ts-ignore
    this.levels$.next([...currentLevels, newLevel]);
  }
}

const replaceAt = (str: string, index: number, replacement: string) => {
  return str.substring(0, index) + replacement + str.substring(index + 1);
}
