import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ELEMENTS_MAP } from '../../../../game/elements-map.js';
import { Vec } from '../../../../game/utils/vec.js';

@Component({
  selector: 'pgb-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="levelGrid">
      <div *ngFor="let row of elementsGrid$ | async" class="elementRow">
        <div *ngFor="let element of row" class="elementCell">
          <div class="elementView {{getElementClassList(element)}}"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
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
  readonly elementsGrid$ = new BehaviorSubject([]);

  constructor() {}

  async ngOnInit() {
    const res = await fetch('api/levels');
    const levels = await res.json();
    this.elementsGrid$.next(levels[0].map(
      (row: string) => ([...row])
    ));
  }

  getElementClassList(elementSymbol: string) {
    let elementClassList = '';

    //@ts-expect-error
    const { type, modifiers } = ELEMENTS_MAP[elementSymbol];

    if (type === 'empty') {
      return elementClassList;
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

    return elementClassList;
  }
}
