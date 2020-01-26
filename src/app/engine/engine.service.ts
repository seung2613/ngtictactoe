import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { GlobalService } from '../global-service';

@Injectable({
    providedIn: 'root'
})
export class EngineService implements OnDestroy {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private mouse: THREE.Vector2;
    private gameOverSub: any;

    private red;
    private INTERSECTED;
    private flag;
    private count;
    private huPlayer;
    private aiPlayer;
    private tie;
    private targetList;
    private props;
    private controls;
    // private projector: THREE.Projector;

    public constructor(private ngZone: NgZone, private globalService: GlobalService) {
        this.flag = false; this.count = 0;
        this.mouse = new THREE.Vector2(0, 0);
        this.huPlayer = { r: 1, g: 0, b: 0 };
        this.aiPlayer = { r: 0, g: 0, b: 1 };
        this.tie = { r: 0, g: 0, b: 0 };
        this.red = new THREE.Color(0xff0000);
        this.onMouseDownFunction = this.onMouseDownFunction.bind(this);
        this.targetList = [
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []]
        ];
    }
    get getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }
    get getScene(): THREE.Scene {
        return this.scene;
    }
    get getControl(): OrbitControls {
        return this.controls;
    }

    public ngOnDestroy() { }

    createScene(canvas: ElementRef<HTMLCanvasElement>): void {
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = canvas.nativeElement;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,    // transparent background
            antialias: true // smooth edges
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // create the scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            16, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        let pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
        let pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        let mycenter = new THREE.Box3().setFromObject(this.scene);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.y = 800;
        this.camera.position.x = 100;
        this.camera.position.z = 50;
        this.camera.lookAt(0);
        // this.camera.position.set(120,50,100);


        this.render();

        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.rotateSpeed = 0.1;
        this.controls.zoomSpeed = 1.2;
        this.controls.center;
        this.controls.minPolarAngle = 0.5;
        this.controls.maxPolarAngle = 1.3;
        this.controls.minAzimuthAngle = 0.1;
        this.controls.maxAzimuthAngle = 0.8;

        this.controls.addEventListener('change', () => { this.render });

        mycenter.getCenter(this.controls.target);
        this.controls.update();

        // spot white light
        pointLight1.position.set(1, 1, 1).normalize();
        pointLight1.position.y = 110;
        pointLight2.position.set(1, 1, 1).normalize();
        pointLight2.position.y = 55;
        directionalLight.position.set(1, 1, 1).normalize();

        this.scene.add(this.camera);
        this.scene.add(pointLight1);
        this.scene.add(pointLight2);
        this.scene.add(directionalLight);

        this.drawCubes();
    }


    animate(): void {
        // We have to run this outside angular zones,
        // because it could trigger heavy changeDetection cycles.
        this.ngZone.runOutsideAngular(() => {
            if (document.readyState !== 'loading') {
                this.render();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    this.render();
                });
            }

            window.addEventListener('resize', () => {
                this.resize();
            });
            window.addEventListener('mousedown', this.onMouseDownFunction, true);
            window.addEventListener('touchdown', this.onMouseDownFunction, true);

            this.gameOverSub = this.globalService.isGameOver.subscribe((val) => {
                if (val == 'true') {
                    this.disableMouseClick();
                }
            })
        });
    }

    createInnerSquare(i, xPosition): void {
        let xDistance = 30;
        let zDistance = 15;
        let geometry = new THREE.BoxGeometry(8, 8, 8);
        for (let j = 0; j < 4; j++) {
            let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                color: 0xc8cfa3,
            }));
            mesh.position.x = xPosition;
            mesh.position.y = xDistance * i;
            mesh.position.z = zDistance * j;
            this.scene.add(mesh);
            this.targetList[i][j].push(mesh);
            // mesh.geometry.center();
        }
        geometry.center();

    }


    turn(point, player): void {
        if (point === undefined) {
        } else if (player === this.huPlayer && point.material.emissive.equals(this.tie)) {
            point.material.emissive.setHex(0xff0000);
            this.globalService.turn = "Blue's turn";
            this.flag = true;
            this.count++;
        } else if (player === this.aiPlayer && point.material.emissive.equals(this.tie)) {

            point.material.emissive.setHex(0x0000ff);
            this.globalService.turn = "Red's turn";
            this.flag = false;
            this.count++;
        }
        console.log(this.count);
    }

    drawCubes(): void {
        let createLayers = 0;
        for (let k = 0; k < 4; k++) {
            for (let i = 0; i < 4; i++) {
                this.createInnerSquare(i, createLayers);
            }
            createLayers += 15;
        }
    }

    onMouseDownFunction(event): void {

        // update the mouse variable
        if (event.type === 'mousedown') {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        } else if (event.type === 'touchend') {
            this.mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
        }
        // find intersections
        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        let vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
        //  projector.unprojectVector( vector, camera );
        let ray = new THREE.Raycaster();
        ray.setFromCamera(this.mouse, this.camera);

        let intersects = ray.intersectObjects(this.scene.children);
        if (intersects.length > 0 && this.INTERSECTED != intersects[0].object) {
            this.INTERSECTED = intersects[0].object;
            if (this.flag && this.count != 64) {
                this.turn(this.INTERSECTED, this.aiPlayer);
                this.INTERSECTED = null;
            } else if (!this.flag && this.count != 64) {
                this.turn(this.INTERSECTED, this.huPlayer);
                this.INTERSECTED = null;
            }
        }

        if (this.winning(this.targetList, this.huPlayer) || this.winning(this.targetList, this.aiPlayer) ||
            this.count == 64) {
            this.globalService.gameOver = "true";

        }

    }
    disableMouseClick(): void {
        window.removeEventListener('mousedown', this.onMouseDownFunction, true);
        window.removeEventListener('touchdown', this.onMouseDownFunction, true);
    }


    winning(list, player): boolean {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (
                    (list[i][0][j].material.emissive.equals(player)
                        && list[i][1][j].material.emissive.equals(player)
                        && list[i][2][j].material.emissive.equals(player)
                        && list[i][3][j].material.emissive.equals(player)) ||
                    (list[i][j][0].material.emissive.equals(player)
                        && list[i][j][1].material.emissive.equals(player)
                        && list[i][j][2].material.emissive.equals(player)
                        && list[i][j][3].material.emissive.equals(player)) ||
                    (list[i][0][3].material.emissive.equals(player)
                        && list[i][1][2].material.emissive.equals(player)
                        && list[i][2][1].material.emissive.equals(player)
                        && list[i][3][0].material.emissive.equals(player)) ||
                    (list[i][3][3].material.emissive.equals(player)
                        && list[i][2][2].material.emissive.equals(player)
                        && list[i][1][1].material.emissive.equals(player)
                        && list[i][0][0].material.emissive.equals(player)) ||
                    (list[0][i][j].material.emissive.equals(player)
                        && list[1][i][j].material.emissive.equals(player)
                        && list[2][i][j].material.emissive.equals(player)
                        && list[3][i][j].material.emissive.equals(player)) ||
                    (list[0][i][3].material.emissive.equals(player)
                        && list[1][i][2].material.emissive.equals(player)
                        && list[2][i][1].material.emissive.equals(player)
                        && list[3][i][0].material.emissive.equals(player)) ||
                    (list[0][0][i].material.emissive.equals(player)
                        && list[1][1][i].material.emissive.equals(player)
                        && list[2][2][i].material.emissive.equals(player)
                        && list[3][3][i].material.emissive.equals(player)) ||
                    (list[0][i][0].material.emissive.equals(player)
                        && list[1][i][1].material.emissive.equals(player)
                        && list[2][i][2].material.emissive.equals(player)
                        && list[3][i][3].material.emissive.equals(player)) ||
                    (list[0][3][i].material.emissive.equals(player)
                        && list[1][2][i].material.emissive.equals(player)
                        && list[2][1][i].material.emissive.equals(player)
                        && list[3][0][i].material.emissive.equals(player)) ||
                    (list[0][0][3].material.emissive.equals(player)
                        && list[1][1][2].material.emissive.equals(player)
                        && list[2][2][1].material.emissive.equals(player)
                        && list[3][3][0].material.emissive.equals(player)) ||

                    (list[0][0][0].material.emissive.equals(player)
                        && list[1][1][1].material.emissive.equals(player)
                        && list[2][2][2].material.emissive.equals(player)
                        && list[3][3][3].material.emissive.equals(player)) ||

                    (list[0][3][3].material.emissive.equals(player)
                        && list[1][2][2].material.emissive.equals(player)
                        && list[2][1][1].material.emissive.equals(player)
                        && list[3][0][0].material.emissive.equals(player)) ||

                    (list[0][3][0].material.emissive.equals(player)
                        && list[1][2][1].material.emissive.equals(player)
                        && list[2][1][2].material.emissive.equals(player)
                        && list[3][0][3].material.emissive.equals(player))
                ) {
                    return true;
                }

            }
        }
        return false;

    }

    render() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
}
