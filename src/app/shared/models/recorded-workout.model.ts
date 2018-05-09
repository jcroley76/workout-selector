import { Exercise } from './exercise.model';

export interface RecordedWorkout {
  id: string;
  date: Date;
  title: string;
  description: string;
  duration: string;
  sources: string[];
  type: string[];
  emphasis: string[];
  exercises: WorkoutExercise[];
  userId: string;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  weight: number;
  reps: number;
  duration: number;
}
