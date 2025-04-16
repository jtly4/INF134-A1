// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class Button extends Widget{
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 80;
    private defaultHeight: number = 30;
    private clickCallback: (() => void) | null = null;

    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        // set Aria role
        this.role = RoleType.button;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        // prevent text selection
        this.selectable = false;
    }

    set fontSize(size:number){
        this._fontSize= size;
        this.update();
    }

    private positionText(){
        let box:Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = (+this._rect.y() + ((+this._rect.height()/2)) - (box.height/2));
        this._text.x(+this._rect.x() + 4);
        if (this._text_y > 0){
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("blue");
        this._rect.fill("green");
        this._text = this._group.text(this._input);
        // Set the outer svg element 
        this.outerSvg = this._group;
        // Add a transparent rect on top of text to 
        // prevent selection cursor and to handle mouse events
        let eventrect = this._group.rect(this.width, this.height).opacity(0).attr('id', 0);

        eventrect.on('click', () => {
            if(this.clickCallback)
            {
                this.clickCallback();
            }
        });

        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(eventrect);
    }

    override update(): void {
        if(this._text != null)
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();

        if(this._rect != null)
            this._rect.fill(this.backcolor);
        
        super.update();
    }

    pressReleaseState(): void{

        if (this.previousState instanceof PressedWidgetState)
            this.raise(new EventArgs(this));

        this._rect.fill("white");
    }
    

    //TODO: implement the onClick event using a callback passed as a parameter
    onClick(callback: () => void):void{
        this.clickCallback = callback;
    }

    viewTime(){
        let d = new Date();
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }
    
    //TODO: give the states something to do! Use these methods to control the visual appearance of your
    //widget
    idleupState(): void {
        if(this._group)
        {
            this._group.opacity(0.7);
        }

        if(this._rect)
        {
            this._rect.fill("gray");
        }

    }
    idledownState(): void {
        this._group.opacity(0.3);
        this._rect.fill("yellow");
    }
    pressedState(): void {
        this._rect.fill("black");
        this._group.opacity(1);
    }
    hoverState(): void {
        this._rect.stroke("green");
        this._rect.fill("red");
        this._group.opacity(1);
    }
    hoverPressedState(): void {
        this._rect.stroke("red");
        this._rect.fill("green");
    }
    pressedoutState(): void {
        if(this._rect)
        { this._rect.fill("blue"); }
        
        this._rect.stroke("purple");
    }
    moveState(): void {
        this._group?.move(200,200);
        this.positionText();

    }
    keyupState(keyEvent?: KeyboardEvent): void {
        if(keyEvent.key)
        {
            this._rect.stroke("orange");
            this._rect.fill("purple");
            this.setState(new PressedWidgetState());
            if(this.clickCallback) {
                this.clickCallback();
            }

            this.setState(new IdleUpWidgetState());
        }
    }
}

export {Button}
