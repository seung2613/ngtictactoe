import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatRipple } from '@angular/material';
import { MatDialog } from '@angular/material';
import { TutorialDialogComponent } from './tutorial-dialog/tutorial-dialog.component'
import { GlobalService } from 'src/app/global-service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {
  private dialogRef: any;
  private open: boolean;
  private turnSub: any;
  private turn: string;
  private isGameOverSub: any;
  private isGameOver: boolean;

  constructor(private dialog: MatDialog, private globalService: GlobalService) {
    this.open = false;
    this.turnSub = this.globalService.whoTurn.subscribe((val) => {
      this.turn = val;
    })
    this.isGameOverSub = this.globalService.isGameOver.subscribe((val) => {
      this.isGameOver = (val == "true");
      if (this.isGameOver) {
        let winner = this.turn == "Blue's turn" ? 'Red' : 'Blue';
        this.turn = `${winner} won !`;
      }
    })
  }

  ngOnInit() {
  }
  
  reload(){
    window.location.reload();
  }


  openDialog(event) {
    if (this.open) return;
    this.dialogRef = this.dialog.open(TutorialDialogComponent, {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '390px',
    });
    this.open = true;
    this.dialog.afterAllClosed.subscribe(() => {
      this.open = false;
    })
  }

  ngOnDestroy() {
    this.turnSub.unsubscribe();
  }

}
