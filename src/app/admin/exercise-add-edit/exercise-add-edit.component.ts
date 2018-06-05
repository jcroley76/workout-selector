import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ExerciseService} from '../exercise.service';
import {DropdownService} from '../../shared/dropdown.service';
import {DropDown} from '../../shared/models/dropdown.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UIService} from '../../shared/ui.service';
import {Exercise} from '../../shared/models/exercise.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Equipment} from '../../shared/models/equipment.model';
import {EquipmentService} from '../equipment.service';

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
  title: string;
  equipmentList: Equipment[];
  equipmentSubscription$: Subscription;
  equipmentItemSubscription$: Subscription;
  muscleGroupList: DropDown[];
  muscleGroupSubscription$: Subscription;
  movementPatternList: DropDown[];
  movementPatternSubscription$: Subscription;
  private loadingSubscription$: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private exerciseService: ExerciseService,
              private equipmentService: EquipmentService,
              private dropdownService: DropdownService,
              private uiService: UIService) {
  }

  ngOnInit() {
    this.loadingSubscription$ = this.uiService.loadingStateChanged$.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    this.equipmentSubscription$ = this.equipmentService.equipmentListChanged$
      .subscribe(eqipList =>
        (this.equipmentList = eqipList)
      );
    this.fetchEquipmentList();

    this.muscleGroupSubscription$ = this.dropdownService.muscleGroupListChanged$
      .subscribe(mgList => {
          this.muscleGroupList = mgList;
        }
      );
    this.fetchMuscleGroupList();

    this.movementPatternSubscription$ = this.dropdownService.movementPatternListChanged$
      .subscribe(mpList => {
          this.movementPatternList = mpList;
        }
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
    if (this.loadingSubscription$) {
      this.loadingSubscription$.unsubscribe();
    }
    if (this.equipmentSubscription$) {
      this.equipmentSubscription$.unsubscribe();
    }
    if (this.muscleGroupSubscription$) {
      this.muscleGroupSubscription$.unsubscribe();
    }
    if (this.movementPatternSubscription$) {
      this.movementPatternSubscription$.unsubscribe();
    }
    if (this.equipmentItemSubscription$) {
      this.equipmentItemSubscription$.unsubscribe();
    }
  }

  fetchEquipmentList() {
    this.equipmentService.fetchEquipmentList();
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

    if (this.editMode) {
      this.exerciseService
        .fetchExercise(this.id)
        .subscribe(
          (ex: Exercise) => {
            // console.log('edit ex', ex);
            if (ex) {
              this.title = ex.name;
              this.exForm.patchValue(ex);
            }
          }
        );
    }
  }

  saveExercise() {
    if (this.editMode) {
      this.exForm.value.id = this.id;
      this.exerciseService.saveExercise(this.exForm.value);
    } else {
      const exValues = this.exForm.value;
      exValues.equipment.forEach(equipItem => {
        const equipment = equipItem.split('|');
        const equipAbbr = equipment[0];
        const equipName = equipment[1];
        if (equipAbbr) {
          const exName = equipAbbr + ' - ' + exValues.name;
          const exercise: Exercise = {...exValues};
          exercise.name = exName;
          exercise.equipment = equipName;
          this.exerciseService.saveExercise(exercise);
        }
      });
    }
    this.onClear();
    this.router.navigate(['/admin/exercises']);
  }

  onClear() {
    this.exForm.reset();
  }
}
