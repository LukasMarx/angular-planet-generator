import { Component, OnInit } from '@angular/core';
import { PolygonService, Vector } from '../polygon.service';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.css']
})
export class PlanetComponent implements OnInit {
  public polygons: { path: string; x: number; y: number; rotation: number }[] = [];

  public radius = 200;

  public crater = [];

  constructor(private polyService: PolygonService) {
    this.polygons = [];
    for (let i = 0; i < 6; i++) {
      let polygon = polyService.generate(0, 200);

      let s = '';

      polygon.points.forEach(point => {
        s += `${point.x},${point.y} `;
      });
      this.polygons.push({ path: s, x: Math.round(Math.random() * 500), y: Math.round(Math.random() * 500), rotation: Math.round(Math.random() * 360) });
    }

    for (let i = 0; i < 200; i++) {
      this.crater.push({ x: Math.random() * 500, y: Math.random() * 500, r: Math.random() * 18 });
    }
  }

  ngOnInit() {}
}
