import {Component, OnDestroy, OnInit} from '@angular/core';
import { AvailableWorkoutService } from '../../admin/available-workout.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AvailableWorkout } from '../../shared/models/available-workout.model';
import { FormsModule } from '@angular/forms';
import { DropdownService } from '../../shared/dropdown.service';
import { DropDown } from '../../shared/models/dropdown.model';

@Component({
  selector: 'app-recommend-workout',
  templateUrl: './recommend-workout.component.html',
  styleUrls: ['./recommend-workout.component.css']
})
export class RecommendWorkoutComponent implements OnInit, OnDestroy {
  private awChangedSubscription: Subscription;
  availableWorkouts: AvailableWorkout[];
  filteredWorkouts: AvailableWorkout[];
  sourceList: DropDown[];
  sourceSubscription: Subscription;
  typeList: DropDown[];
  typeSubscription: Subscription;
  emphasisList: DropDown[];
  emphasisSubscription: Subscription;

  /// filter-able properties
  title: string;
  source: string;
  type: string;
  emphasis: string;
  /// Active filter rules
  filters = {};

  constructor( private availableWorkoutService: AvailableWorkoutService,
               private dropdownService: DropdownService) { }

  ngOnInit() {
    this.awChangedSubscription = this.availableWorkoutService.availableWorkoutsChanged$.subscribe(
      (availableWorkouts: AvailableWorkout[]) => {
        console.log('availableWorkouts', availableWorkouts);
        this.availableWorkouts = availableWorkouts;
        // this.applyFilters();
      }
    );
    this.availableWorkoutService.fetchAvailableWorkouts();

    this.sourceSubscription = this.dropdownService.sourceListChanged
      .subscribe(srcList =>
        (this.sourceList = srcList)
      );
    this.fetchSourceList();

    this.typeSubscription = this.dropdownService.typeListChanged
      .subscribe(typList =>
        (this.typeList = typList)
      );
    this.fetchTypeList();

    this.emphasisSubscription = this.dropdownService.emphasisListChanged
      .subscribe(empList =>
        (this.emphasisList = empList)
      );
    this.fetchEmphasisList();
  }

  ngOnDestroy() {
    if (this.sourceSubscription) {
      this.sourceSubscription.unsubscribe();
    }
    if (this.typeSubscription) {
      this.typeSubscription.unsubscribe();
    }
    if (this.emphasisSubscription) {
      this.emphasisSubscription.unsubscribe();
    }
  }

  fetchSourceList() {
    this.dropdownService.fetchSourceList();
  }

  fetchTypeList() {
    this.dropdownService.fetchTypeList();
  }

  fetchEmphasisList() {
    this.dropdownService.fetchEmphasisList();
  }

  /// Filtering functions
  private applyFilters() {
    this.filteredWorkouts = _.filter(this.availableWorkouts, _.conforms(this.filters) );
    console.log('filteredWorkouts', this.filteredWorkouts);
  }

  /// filter property by equality to rule
  // https://angularfirebase.com/lessons/multi-property-data-filtering-with-firebase-and-angular-4/
  filterExact(property: string, rule: any) {
    console.log('filterExact', property, rule);
    this.filters[property] = val => val === rule;
    console.log('filters', this.filters);
    this.applyFilters();
  }
  /// filter  numbers greater than rule
  filterContains(property: string, rule: number) {
    console.log('filterContains', property, rule);
    this.filters[property] = val => _.find(val, rule);
    console.log('filters', this.filters);
    this.applyFilters();
  }
  /// filter  numbers greater than rule
  filterGreaterThan(property: string, rule: number) {
    this.filters[property] = val => val > rule;
    this.applyFilters();
  }

  /// filter properties that resolve to true
  filterBoolean(property: string, rule: boolean) {
    if (!rule) {
      this.removeFilter(property);
    } else {
      this.filters[property] = val => val;
      this.applyFilters();
    }
  }

  /// removes filter
  removeFilter(property: string) {
    delete this.filters[property];
    this[property] = null
    this.applyFilters();
  }
}
