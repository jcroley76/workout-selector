export interface AvailableWorkout {
  id: string;
  title: string;
  description: string;
  duration: string;
  source: string;
  equipment: string[];
  type: string[];
  emphasis: string[];
  // TODO: In the DB some of these are arrays with ['weight', 'reps']
  // Make a string and add a Measurement type of 'Sets and Reps' or something.
  record: string;
}
