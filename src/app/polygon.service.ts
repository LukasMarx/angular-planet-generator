import { Injectable } from '@angular/core';

export interface Vector {
  x: number;
  y: number;
}

export interface Polygon {
  points: Vector[];
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class PolygonService {
  constructor() {}

  // algorithm source: http://cglab.ca/~sander/misc/ConvexGeneration/convex.html
  generate(width: number, height: number) {
    let x = this.generateRandomNumbers(20, 0, 10);
    let y = this.generateRandomNumbers(20, 0, 10);

    x.sort((a, b) => a - b);
    y.sort((a, b) => a - b);

    const vectorLengthsX = this.generateRandomVectorLengths(x);
    const vectorLengthsY = this.generateRandomVectorLengths(y);

    const vectors = this.randomPairUp(vectorLengthsX, vectorLengthsY);

    let sortedVectors = this.sortVectorsByAngle(vectors);

    console.log(sortedVectors);

    sortedVectors = this.interpolateVectors(sortedVectors);

    const polygon = this.buildPolygon(sortedVectors);

    console.log(polygon.points);

    const boundingBox = this.getBoundingBox(polygon);

    const transformedPolygon = this.transformPolygon(200, 200, polygon, boundingBox);

    return transformedPolygon;
  }

  generateRandomNumbers(n: number, min: number, max: number) {
    const result = [];
    for (let i = 0; i < n; i++) {
      result.push(Math.floor(Math.random() * 200));
    }
    return result;
  }

  generateRandomVectorLengths(input: number[]): number[] {
    const array = [...input];

    const max = array.pop();
    const min = array.splice(0, 1)[0];

    const chainA: number[] = [];
    const chainB: number[] = [];

    array.forEach(num => {
      const rand = Math.random();
      if (rand < 0.5) {
        chainA.push(num);
      } else {
        chainB.push(num);
      }
    });

    const vectorLengths = [];

    for (let i = 0; i < chainA.length; i++) {
      if (i == 0) {
        vectorLengths.push(chainA[i] - min);
      } else {
        vectorLengths.push(chainA[i] - chainA[i - 1]);
      }
    }
    vectorLengths.push(max - chainA[chainA.length - 1]);

    for (let i = chainB.length - 1; i >= 0; i--) {
      if (chainB.length - 1) {
        vectorLengths.push(chainB[i] - max);
      } else {
        vectorLengths.push(chainB[i] - chainB[i + 1]);
      }
    }
    vectorLengths.push(min - chainB[0]);

    return vectorLengths;
  }

  randomPairUp(lx: number[], ly: number[]): Vector[] {
    const x = [...lx];
    const y = [...ly];

    x.sort(() => 0.5 - Math.random());
    y.sort(() => 0.5 - Math.random());

    const vectors: Vector[] = [];
    x.forEach((e, i) => {
      vectors.push({
        x: e,
        y: y[i]
      });
    });
    return vectors;
  }

  calculateVectorAngle(v: Vector): number {
    const angle = Math.atan2(v.y, v.x);
    const degrees = (180 * angle) / Math.PI;
    return (360 + Math.round(degrees)) % 360;
  }

  sortVectorsByAngle(vectors: Vector[]) {
    const v = [...vectors];

    v.sort((a, b) => this.calculateVectorAngle(b) - this.calculateVectorAngle(a));

    return v;
  }

  buildPolygon(vectors: Vector[]): Polygon {
    const vs = [...vectors];
    let result: Vector[] = [];
    result.push(vs.pop());

    result[0].x += 1000;
    result[0].y += 1000;

    for (let i = vs.length - 1; i >= 0; i--) {
      const prev = result[result.length - 1];
      result.push({ x: prev.x + vs[i].x, y: prev.y + vs[i].y });
    }

    result = result.map(p => ({
      x: p.x + (Math.random() * 200 - 100),
      y: p.y + (Math.random() * 200 - 100)
    }));

    return { points: result };
  }

  getBoundingBox(polygon: Polygon): Rectangle {
    let minX = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;

    polygon.points.forEach(p => {
      minX = minX > p.x ? p.x : minX;
      maxX = maxX < p.x ? p.x : maxX;
      minY = minY > p.y ? p.y : minY;
      maxY = maxY < p.y ? p.y : maxY;
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  transformPolygon(width: number, height: number, polygon: Polygon, boundingBox: Rectangle): Polygon {
    const p = [...polygon.points];

    const fX = width / boundingBox.width;
    const fY = height / boundingBox.height;

    const dX = boundingBox.x * fX;
    const dY = boundingBox.y * fY;

    const rp = p.map(p => ({ x: p.x * fX - dX, y: p.y * fY - dY }));

    return { points: rp };
  }

  interpolateVectors(vectors: Vector[]) {
    const p = [...vectors];

    const inter = [];
    for (let i = 0; i < p.length; i++) {
      if (i > 0) {
        const b = p[i];
        const a = p[i - 1];

        const lengthX = Math.abs(b.x - a.x);
        const lengthY = Math.abs(b.y - a.y);

        const length = Math.sqrt(lengthX * lengthX + lengthY * lengthY);

        const step = length % 10;

        const normX = lengthX / length;
        const normY = lengthY / length;
        console.log(length);

        for (let i = 0; i < step; i++) {
          inter.push({
            x: Math.round(a.x + step * normX),
            y: Math.round(a.y + step * normY)
          });
        }
      }
      inter.push(p[i]);
    }
    return inter;
  }
}
