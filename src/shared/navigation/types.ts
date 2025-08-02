import { routes } from './routes';

export type Routes = (typeof routes)[keyof typeof routes];
