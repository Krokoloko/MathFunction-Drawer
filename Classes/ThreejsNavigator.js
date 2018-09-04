class ThreeNavigator {
  constructor(camera) {
    this.camera = camera || new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);
  }

  rotate(x,y,z){
    let rotAdd = new THREE.Vector3(x || 0,y || 0,z || 0);
    this.camera.rotation.x += rotAdd.x;
    this.camera.rotation.y += rotAdd.y;
    this.camera.rotation.z += rotAdd.z;
  }
  move(x,y,z){
    let posAdd = new THREE.Vector3(x || 0,y || 0,z || 0);
    this.camera.position.x += posAdd.x;
    this.camera.position.y += posAdd.y;
    this.camera.position.z += posAdd.z;

  }
}
