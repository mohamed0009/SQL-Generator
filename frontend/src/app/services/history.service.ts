import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Table } from '../models/sql.models';

export interface HistoryState {
  tables: Table[];
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private states: HistoryState[] = [];
  private currentIndex = -1;
  private maxStates = 50; // Maximum number of states to keep

  private canUndoSubject = new BehaviorSubject<boolean>(false);
  private canRedoSubject = new BehaviorSubject<boolean>(false);

  canUndo$ = this.canUndoSubject.asObservable();
  canRedo$ = this.canRedoSubject.asObservable();

  push(tables: Table[]): void {
    // Remove any future states if we're not at the end
    if (this.currentIndex < this.states.length - 1) {
      this.states = this.states.slice(0, this.currentIndex + 1);
    }

    // Add new state
    this.states.push({
      tables: JSON.parse(JSON.stringify(tables)), // Deep copy
      timestamp: Date.now(),
    });

    // Remove oldest state if we exceed maxStates
    if (this.states.length > this.maxStates) {
      this.states.shift();
    }

    this.currentIndex = this.states.length - 1;
    this.updateCanUndoRedo();
  }

  undo(): Table[] | null {
    if (!this.canUndo()) return null;

    this.currentIndex--;
    this.updateCanUndoRedo();
    return JSON.parse(JSON.stringify(this.states[this.currentIndex].tables));
  }

  redo(): Table[] | null {
    if (!this.canRedo()) return null;

    this.currentIndex++;
    this.updateCanUndoRedo();
    return JSON.parse(JSON.stringify(this.states[this.currentIndex].tables));
  }

  private canUndo(): boolean {
    return this.currentIndex > 0;
  }

  private canRedo(): boolean {
    return this.currentIndex < this.states.length - 1;
  }

  private updateCanUndoRedo(): void {
    this.canUndoSubject.next(this.canUndo());
    this.canRedoSubject.next(this.canRedo());
  }

  clear(): void {
    this.states = [];
    this.currentIndex = -1;
    this.updateCanUndoRedo();
  }
}
