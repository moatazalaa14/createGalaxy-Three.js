import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * gnerateGlaxy
 */
const parameters={}
parameters.count=100000
parameters.size=0.01
parameters.radius=5
parameters.branches=3
parameters.spin=1
parameters.randomness=0.2
parameters.powRandomness=3
parameters.insideColor=0xff0000;
parameters.outsideColor=0x0000ff;

const positions=new Float32Array(parameters.count*3)
const colors=new Float32Array(parameters.count*3)

let starsGeometry=null
let starsMaterials =null
let points =null
const generateGalaxy=()=>{

starsGeometry=new THREE.BufferGeometry()
starsMaterials=new THREE.PointsMaterial()
// starsMaterials.color=new THREE.Color("red")
starsMaterials.size=parameters.size
starsMaterials.depthWrite=false;
starsMaterials.sizeAttenuation=true
starsMaterials.vertexColors=true
if(points !== null){
    starsGeometry.dispose()
    starsMaterials.dispose()
    scene.remove(points)
}

starsMaterials.blending=THREE.AdditiveBlending
let insideColor=new THREE.Color(parameters.insideColor)
    let outsideColor=new THREE.Color(parameters.outsideColor)

for(let i=0;i<parameters.count;i++){

    

    let radius=Math.random() * parameters.radius

    let xRandom=Math.pow(Math.random(),parameters.powRandomness) * (Math.random() < .5 ? 1 :-1)
   

    let branchAngle=(i%parameters.branches) / parameters.branches * Math.PI*2
    let spinAngle=radius*parameters.spin
    let i3=i*3

    let mixedColor=insideColor.clone()
    mixedColor.lerp(outsideColor,radius/parameters.radius)

    colors[i3]=mixedColor.r
    colors[i3 +1] =mixedColor.g
    colors[i3 +2] =mixedColor.b

    positions[i3]=Math.cos(branchAngle + spinAngle) * radius +xRandom
    positions[i3+1]=0 +xRandom
    positions[i3+2]=Math.sin(branchAngle + spinAngle) * radius +xRandom


        //positions[i]=(Math.random() -.5) *10
}

starsGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
starsGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

points=new THREE.Points(starsGeometry,starsMaterials)
scene.add(points)
}

generateGalaxy()
gui.add(parameters,'count').min(100).max(10000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.01).max(.1).step(0.01).onFinishChange(generateGalaxy)

gui.add(parameters,'radius').min(1).max(10).step(1).onFinishChange(generateGalaxy)

gui.add(parameters,'branches').min(1).max(10).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(-5).max(5).step(.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0.01).max(.1).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'powRandomness').min(1).max(10).step(1).onFinishChange(generateGalaxy)
gui.addColor(parameters,'insideColor').min(1).max(10).step(1).onFinishChange(generateGalaxy)
gui.addColor(parameters,'outsideColor').min(1).max(10).step(1).onFinishChange(generateGalaxy)


scene.add(new THREE.AxesHelper())

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()