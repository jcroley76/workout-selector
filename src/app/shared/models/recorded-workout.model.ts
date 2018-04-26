import { Exercise } from './exercise.model';
// import { User } from '../../auth/user.model';

export interface RecordedWorkout {
  id: string;
  date: Date;
  title: string;
  description: string;
  duration: string;
  sources: string;
  type: string;
  emphasis: string;
  exercises: WorkoutExercise[];
  // TODO:
  // user: User;
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
