import { Exercise } from './exercise.model';

export interface RecordedWorkout {
  id: string;
  title: string;
  description: string;
  duration: string;
  source: string;
  type: string;
  emphasis: string;
  record: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  exercise: Exercise;
  weight: number;
  reps: number;
  duration: number;
}
