import { Injectable } from '@angular/core';

export interface Vector {
  x: number;
  y: number;
}
export interface Polygon {
  points: Vector[];
}

@Injectable({
  providedIn: 'root'
})
export class RockTextureService {
  constructor() {}

  generate() {}
}
