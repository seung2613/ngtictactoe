import { NgModule } from '@angular/core';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatTabsModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatGridListModule,
  MatMenuModule,
  MatIconModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatBottomSheetModule,
  MatBottomSheet,
  MatDividerModule,
  MatFormFieldModule,
  MatExpansionModule
} from '@angular/material';

const MODULES = [
  MatAutocompleteModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatCardModule,
  MatTabsModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatGridListModule,
  MatMenuModule,
  MatIconModule,
  MatSnackBarModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatBottomSheetModule,
  MatDividerModule,
  MatFormFieldModule,
  MatExpansionModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
  providers: [MatBottomSheet]
})
export class MaterialModule {}
