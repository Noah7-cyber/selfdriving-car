import { Control } from "./control.js";
import { Sensor } from "./sensor.js";
import { polysIntersect } from "./utils.js";
import { NeuralNetwork } from "./network.js";
export class Car{
    constructor(x, y, width, height, controlType, maxSpeed =3){
        this.x =x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed =0;
        this.accerleration =0.2;
        
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle =0;
        this.damaged = false;
        this.polygon ;
        this.useBrain = controlType == "AI";
        if(controlType !== "DUMMY"){
        this.sensor = new Sensor(this);
        this.brain =  new NeuralNetwork(
            [this.sensor.rayCount, 6, 6, 4]
        );
        }
        this.controls = new Control(controlType);
    }
    update(roadBorders, traffic){
        
        if(!this.damaged){
            this.#move();
        this.polygon = this.#createPolygon();
        this.damaged= this.#accessDamage(roadBorders, traffic);  
        }
        if(this.sensor){
        this.sensor.update(roadBorders, traffic);
        const offsets = this.sensor.readings.map( s => s == null? 0: 1-s.offset);
        const outputs = NeuralNetwork.feedForward(offsets, this.brain);
           
                if(this.useBrain){
                    this.controls.forward = outputs[0];
                    this.controls.left = outputs[1];
                    this.controls.right = outputs[2];
                    this.controls.reverse = outputs[3];
                }
        }
    }
    #accessDamage(roadBorders, traffic){
        
        for (let i = 0; i < roadBorders.length; i++) {
           if(polysIntersect(this.polygon, roadBorders[i])){
            return true;
           }
        }
        for (let i = 0; i < roadBorders.length; i++) {
                if (traffic[i] != undefined) {
                    
                    if(polysIntersect(this.polygon, traffic[i].polygon)){
                        return true;
                       }
                }
          
         }
        return false;
    }
    #createPolygon(){
        const points =[];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x:this.x - Math.sin(this.angle -alpha) *rad,
            y: this.y - Math.cos( this.angle - alpha)*rad
        })
        points.push({
            x:this.x - Math.sin( this.angle+alpha) *rad,
            y: this.y - Math.cos( this.angle + alpha)*rad
        })
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle-alpha) *rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha)*rad
        })
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle+alpha) *rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha)*rad
        })
        return points;
    }
    
   
    #move(){
        if(this.controls.forward){
            this.speed +=this.accerleration;
           
         }else if(this.controls.reverse){
             this.speed -=this.accerleration;       
         }
         if(this.speed > this.maxSpeed){
             this.speed = this.maxSpeed;
         } else if(this.speed < -this.maxSpeed/2){
             this.speed = -this.maxSpeed/2;
         }
         if(this.speed > 0){
             this.speed -= 0.05;
         }else if(this.speed <0){
             this.speed += this.friction;
         }
         if(this.speed !==0){
             const flip = this.speed>0 ?1 :-1;
              if(this.controls.right){
                 this.angle -= 0.03 *flip;
             }else if(this.controls.left){
                     this.angle += 0.03 *flip;
             }
         }
         if(Math.abs(this.speed)< this.friction){
             this.speed =0;
         }
         this.x -= Math.sin(this.angle)*this.speed;
         this.y -= Math.cos(this.angle)*this.speed;
    }
    draw(ctx, color, drawSensor){
        
        if(this.damaged){
            ctx.fillStyle ="gray";
        }else{
            ctx.fillStyle = color
        }
        if(this.polygon !== undefined){
            ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
           
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
            
        }
        ctx.fill();
        }
        if(this.sensor && drawSensor){
        this.sensor.draw(ctx);
        }
    }
}
