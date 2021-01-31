import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mathFloor' })
export class MathFloorPipe implements PipeTransform {
  constructor() {}
  transform(data: number) {
    return Math.floor(data);
  }
} 