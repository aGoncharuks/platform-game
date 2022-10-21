import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, tap, withLatestFrom } from 'rxjs';
import { BuilderState, GameElement, GameElementCoordinates, GameLevel } from './builder.types';

const levelWidthInElements = 80;
const levelHeightInElements = 25;

const initialBuilderStore: BuilderState = {
  levels: [],
  selectedLevelIndex: 0,
  selectedElement: undefined,
  showPreview: false
}

@Injectable()
export class BuilderComponentStore extends ComponentStore<BuilderState> {
  constructor(private http: HttpClient) {
    super(initialBuilderStore);
  }

  levels$ = this.select(state => state.levels);
  selectedLevelIndex$ = this.select(state => state.selectedLevelIndex);
  selectedElement$ = this.select(state => state.selectedElement);
  showPreview$ = this.select(state => state.showPreview);

  setLevels = this.updater<GameLevel[]>(
    (state, levels) => ({...state, levels})
  );

  setSelectedLevelIndex = this.updater<number>(
    (state, selectedLevelIndex) => ({...state, selectedLevelIndex})
  );

  setSelectedElement = this.updater<GameElement>(
    (state, selectedElement) => ({...state, selectedElement})
  );

  replaceElementWithSelected = this.updater<GameElementCoordinates>(
    (state, coordinates) => {
      const levels = [...state.levels];
      const selectedLevel = levels[state.selectedLevelIndex];
      const selectedElementKey = state.selectedElement?.key;

      if (selectedElementKey === undefined) { return state; }

      selectedLevel[coordinates.y] = replaceAt(selectedLevel[coordinates.y], coordinates.x, selectedElementKey);
      levels[state.selectedLevelIndex] = selectedLevel;

      return {...state, levels};
    }
  );

  addLevel = this.updater(
    (state) => {
      const newLevel = new Array(levelHeightInElements).fill(
        '.'.repeat(levelWidthInElements)
      );
      return {...state, levels: [...state.levels, newLevel]}
    }
  );

  togglePreview = this.updater(
    (state) => {
      return {...state, showPreview: !state.showPreview }
    }
  );

  loadLevels = this.effect(event$ => {
    return event$.pipe(
      switchMap(() => this.http.get<BuilderState['levels']>('http://localhost:3333/api/levels')),
      tap(levels => this.setLevels(levels))
    );
  });

  saveLevels = this.effect(event$ => {
    return event$.pipe(
      withLatestFrom(this.levels$),
      switchMap(([_, levels]) => this.http.post('http://localhost:3333/api/levels', levels))
    );
  });
}

const replaceAt = (str: string, index: number, replacement: string) => {
  return str.substring(0, index) + replacement + str.substring(index + 1);
}

