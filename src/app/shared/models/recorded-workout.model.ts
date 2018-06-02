import { Exercise } from './exercise.model';

export interface RecordedWorkout {
  id: string;
  date: Date;
  title: string;
  description: string;
  notes: string;
  duration: string;
  source: string;
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
