import {Car} from './car.js';
import { Road } from './road.js';
import { Visualizer } from './Visualizer.js';
const carCanvas = document.querySelector('#carCanvas');
const networkCanvas = document.querySelector('#networkCanvas');
carCanvas.width = 200;
networkCanvas.width = 300;
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext('2d')
const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 4);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const N=100;
const cars = generateCars(N)
const traffic =[
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]
function generateCars(N) {
    const cars =[];
    for (let i = 0; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30,50,'AI'))
        
    }
    return cars
}

const animate =(time) =>{
    
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
        
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);  
    }
   
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -cars[0].y+carCanvas.height*0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red")
        
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");  
    }
      carCtx.globalAlpha =1;
    carCtx.restore(); 
    networkCtx.lineDashOffset =-time/60;
    Visualizer.drawNetwork(networkCtx, cars[0].brain);
    requestAnimationFrame(animate);
}
animate();
