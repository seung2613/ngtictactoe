import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
    whoTurn: Subject<any> = new Subject<any>();
    isGameOver: Subject<any> = new Subject<any>();
 
    constructor() { }

    set turn(value: string) {
        this.whoTurn.next(value);
        localStorage.setItem('turn', value);
    }

    get turn() {
        return localStorage.getItem('turn');
    }

    set gameOver(value: string) {
        this.isGameOver.next(value);
        localStorage.setItem('isGameOver', value);
    }
    get gameOver() {
        return localStorage.getItem('isGameOver');
    }

}