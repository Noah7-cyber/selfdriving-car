export class Control{
    constructor(type){
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        switch (type) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;

                case "DUMMY":
                    this.forward = true
                break;
        }
       
    }
    #addKeyboardListeners(){
        document.onkeydown = (e) => {
            if(e.key == 'ArrowLeft'){
                this.left = true;
            }else  if(e.key == 'ArrowRight'){
                this.right = true;
            }else  if(e.key == 'ArrowUp'){
                this.forward = true;
            }else  if(e.key == 'ArrowDown'){
                this.reverse = true;
            }
           
        }
        document.onkeyup = (e) => {
            if(e.key == 'ArrowLeft'){
                this.left = false;
            }else  if(e.key == 'ArrowRight'){
                this.right = false;
            }else  if(e.key == 'ArrowUp'){
                this.forward = false;
            }else  if(e.key == 'ArrowDown'){
                this.reverse = false;
            }
           
        }
    }

}
