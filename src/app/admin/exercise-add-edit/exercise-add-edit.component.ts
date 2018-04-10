import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExerciseService } from '../exercise.service';
import { DropdownService } from '../../shared/dropdown.service';
import { DropDown } from '../../shared/models/dropdown.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UIService } from '../../shared/ui.service';
import { Exercise } from '../../shared/models/exercise.model';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-exercise-add-edit',
  templateUrl: './exercise-add-edit.component.html',
  styleUrls: ['./exercise-add-edit.component.css']
})
export class ExerciseAddEditComponent implements OnInit, OnDestroy {
  exForm: FormGroup;
  isLoading = true;
  editMode = false;
  id: string;
  equipmentList: DropDown[];
  equipmentSubscription: Subscription;
  muscleGroupList: DropDown[];
  muscleGroupSubscription: Subscription;
  movementPatternList: DropDown[];
  movementPatternSubscription: Subscription;
  private loadingSubscription: Subscription;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private availableWorkoutService: ExerciseService,
               private dropdownService: DropdownService,
               private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    this.equipmentSubscription = this.dropdownService.equipmentListChanged
      .subscribe(eqipList =>
        (this.equipmentList = eqipList)
      );
    this.fetchEquipmentList();

    this.muscleGroupSubscription = this.dropdownService.muscleGroupListChanged
      .subscribe(empList =>
        (this.muscleGroupList = empList)
      );
    this.fetchMuscleGroupList();

    this.movementPatternSubscription = this.dropdownService.movementPatternListChanged
      .subscribe(meaList =>
        (this.movementPatternList = meaList)
      );
    this.fetchMovementPatternList();

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.equipmentSubscription) {
      this.equipmentSubscription.unsubscribe();
    }
    if (this.muscleGroupSubscription) {
      this.muscleGroupSubscription.unsubscribe();
    }
    if (this.movementPatternSubscription) {
      this.movementPatternSubscription.unsubscribe();
    }
  }

  fetchEquipmentList() {
    this.dropdownService.fetchEquipmentList();
  }

  fetchMuscleGroupList() {
    this.dropdownService.fetchMuscleGroupList();
  }

  fetchMovementPatternList() {
    this.dropdownService.fetchMovementPatternList();
  }

  // Example: https://toddmotto.com/angular-2-form-controls-patch-value-set-value
  initForm() {
    this.exForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'description': new FormControl(''),
      'movementPattern': new FormControl('', Validators.required),
      'equipment': new FormControl('', Validators.required),
      'muscleGroup': new FormControl(''),
    });

    console.log('editMode', this.editMode);
    if (this.editMode) {
      this.availableWorkoutService
        .fetchExercise(this.id)
        .subscribe(
          (aw: Exercise) => {
            console.log('edit aw', aw);
            if (aw) {
              this.exForm.patchValue(aw);
            }
          }
        );
    }
  }

  saveExercise() {
    if (this.editMode) {
      console.log('save available workout', this.exForm.value);
      this.availableWorkoutService.updateDataToDatabase(this.id, this.exForm.value);
    } else {
      this.availableWorkoutService.addDataToDatabase(this.exForm.value);
    }
    this.onClear();
    this.router.navigate(['/admin/exercises']);
  }

  onClear() {
    this.exForm.reset();
  }
}
