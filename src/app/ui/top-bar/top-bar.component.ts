import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatRipple } from '@angular/material';
import { MatDialog } from '@angular/material';
import { TutorialDialogComponent } from './tutorial-dialog/tutorial-dialog.component'
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  dialogRef: any;
  open: boolean;



  constructor(private dialog: MatDialog) {
    this.open = false;
  }

  ngOnInit() {
  }


  openDialog(event) {
    if (this.open) return;
    this.dialogRef = this.dialog.open(TutorialDialogComponent, {
      width: '80%',
      maxWidth: '600px',
      maxHeight: '390px',
    });
    this.open=true;
    this.dialog.afterAllClosed.subscribe(()=>{
      this.open=false;
    })
  }



}
