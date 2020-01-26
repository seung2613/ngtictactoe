import { Component, OnInit } from '@angular/core';
import { EngineService } from '../../engine/engine.service';
@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent implements OnInit {

  constructor(private engineService: EngineService) {
  }

  ngOnInit() {
  }

  rotateCamera() {
    // var speed = Date.now() * 0.00025;
    // let camera = this.engineService.getCamera;
    // let scene = this.engineService.getScene;
    // camera.position.x = Math.cos(speed) * 10;
    // camera.position.z = Math.sin(speed) * 10;
    // camera.lookAt(scene.position); 
    // let controls = this.engineService.getControl;
    
   // controls.rotateLeft(Math.PI/2);
  }
}
