/** 
 * @file main.ts
 * @brief YFROBOT's GooBit makecode library.
 * @n This is a MakeCode graphics programming extension 
 *    for MicroBit motor drive expansion board.
 * 
 * @copyright    YFROBOT,2021
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](yfrobot@qq.com)
 * @date  2021-06-11
*/

// motor pin 
let GooBitMotorADIR = DigitalPin.P13
let GooBitMotorAPWM = AnalogPin.P14
let GooBitMotorBDIR = DigitalPin.P15
let GooBitMotorBPWM = AnalogPin.P16
// ultrasonic pin
let GooBitUltrasonicTrig = DigitalPin.P8
let GooBitUltrasonicEcho = DigitalPin.P9
let GooBit_distanceBuf = 0
// track pin
let GooBitTrackENPin = DigitalPin.P12
let GooBitTrackLeft = AnalogPin.P0
let GooBitTrackMiddle = AnalogPin.P1
let GooBitTrackRight = AnalogPin.P2
// Track sensor Threshold
let GooBitDarkValveVal = 600;
let GooBitLightValveVal = 400;

// rgbLED pin DigitalPin.P11

    /////////////////////// RGB LED ///////////////////////
    let rgbLEDPin = DigitalPin.P11;
    let rgbLEDBrightness = 255;
    /////////////////////// RGB LED ///////////////////////

    /////////////////////// Buzzer ///////////////////////
    let buzzerPin = DigitalPin.P10;
    /////////////////////// Buzzer ///////////////////////

//% color="#fcb70a" weight=10 icon="\uf192"
namespace GooBit {

    /////////////////////// IR ///////////////////////
    let irState: IrState

    const MICROBIT_MAKERBIT_IR_NEC = 777
    const MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID = 789
    const MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID = 790
    const IR_REPEAT = 256
    const IR_INCOMPLETE = 257

    interface IrState {
        protocol: IrProtocol;
        command: number;
        hasNewCommand: boolean;
        bitsReceived: uint8;
        commandBits: uint8;
    }

    export enum IrProtocol {
        //% block="Keyestudio"
        Keyestudio = 0,
        //% block="NEC"
        NEC = 1,
    }

    export enum IrButtonAction {
        //% block="pressed"
        Pressed = 0,
        //% block="released"
        Released = 1,
    }

    export enum IrButton {
        // any button
        //% block="Any"
        Any = -1,

        //IR HANDLE
        //% block="↑"
        UP = 0x11,
        //% block="↓"
        DOWN = 0x91,
        //% block="←"
        LEFT = 0x81,
        //% block="→"
        RIGHT = 0xa1,
        //% block="M1"
        M1 = 0xe9,
        //% block="M2"
        M2 = 0x69,
        //% block="A"
        A = 0x21,
        //% block="B"
        B = 0x01,

        // MINI IR 
        //% block="A"
        Mini_A = 0xa2,
        //% block="B"
        Mini_B = 0x62,
        //% block="C"
        Mini_C = 0xe2,
        //% block="D"
        Mini_D = 0x22,
        //% block="︿"
        Mini_UP = 0x02,
        //% block="E"
        Mini_E = 0xc2,
        //% block="＜"
        Mini_Left = 0xe0,
        //% block="۞"
        Mini_SET = 0xa8,
        //% block="＞"
        Mini_Right = 0x90,
        //% block="0"
        Number_0 = 0x68,
        //% block="﹀"
        Mini_Down = 0x98,
        //% block="F"
        Mini_F = 0xb0,
        //% block="1"
        Number_1 = 0x30,
        //% block="2"
        Number_2 = 0x18,
        //% block="3"
        Number_3 = 0x7a,
        //% block="4"
        Number_4 = 0x10,
        //% block="5"
        Number_5 = 0x38,
        //% block="6"
        Number_6 = 0x5a,
        //% block="7"
        Number_7 = 0x42,
        //% block="8"
        Number_8 = 0x4a,
        //% block="9"
        Number_9 = 0x52,
    }
    /////////////////////// IR ///////////////////////

    export enum Motors {
        //% blockId="MRightMotor" block="MA"
        MA = 0,
        //% blockId="MLeftMotor" block="MB"
        MB = 1,
        //% blockId="AllMotors" block="All"
        MAll = 2
    }

    export enum Dir {
        //% blockId="CW" block="Forward"
        CW = 0x0,
        //% blockId="CCW" block="Reverse"
        CCW = 0x1
    }

    export enum TrackEnable {
        //% blockId="TrackOn" block="ON"
        TrackOn = 0x01,
        //% blockId="TrackOff" block="OFF"
        TrackOff = 0x00
    }

    export enum Track {
        //% blockId="TrackLeft" block="left"
        TrackLeft = 1,
        //% blockId="TrackMiddle" block="middle"
        TrackMiddle = 2,
        //% blockId="TrackRight" block="right"
        TrackRight = 3
    }

    export enum TrackingState {
        //% block="◌ ● ◌" enumval=0
        M_line_LR_unline,
        //% block="◌ ○ ●" enumval=1
        L_unline_M_unknow_R_line,
        //% block="● ○ ◌" enumval=2
        L_line_M_unknow_R_unline,
        //% block="◌ ◌ ◌" enumval=3
        M_L_R_unline,
        //% block="● ● ●" enumval=4
        M_L_R_line
    }
    /** Line Sensor events    MICROBIT_PIN_EVT_RISE **/
    export enum MbEvents {
        //% block="Found" 
        FindLine = DAL.MICROBIT_PIN_EVT_FALL,
        //% block="Lost" 
        LoseLine = DAL.MICROBIT_PIN_EVT_RISE
    }
    
    export enum CarMoving {
        //% blockId="TurnForward" block="Forward"
        TForward = 0,
        //% blockId="TurnBack" block="Back"
        TBack = 1,
        //% blockId="TurnLeft" block="Left"
        TLeft = 2,
        //% blockId="TurnRight" block="Right"
        TRight = 3,
        //% blockId="TurnLeftRotate" block="LeftRotate"
        TLeftRotate = 4,
        //% blockId="TurnRightRotate" block="RightRotate"
        TRightRotate = 5,
    }

    export enum RGBLEDColorMode {
        //% block="Single Color"
        SingleColor = 0,
        //% block="Rainbow"
        Rainbow = 1,
        //% block="Breathing"
        Breathing = 2,
        //% block="Flashing"
        Flashing = 3,
    }

    export enum LEDColor {
        //% block="Red"
        Red = 0xFF0000,
        //% block="Green"
        Green = 0x00FF00,
        //% block="Blue"
        Blue = 0x0000FF,
        //% block="White"
        White = 0xFFFFFF,
        //% block="Yellow"
        Yellow = 0xFFFF00,
        //% block="Cyan"
        Cyan = 0x00FFFF,
        //% block="Magenta"
        Magenta = 0xFF00FF,
        //% block="Off"
        Off = 0x000000,
    }

    export enum BuzzerNote {
        //% block="C"
        C = 262,
        //% block="D"
        D = 294,
        //% block="E"
        E = 330,
        //% block="F"
        F = 349,
        //% block="G"
        G = 392,
        //% block="A"
        A = 440,
        //% block="B"
        B = 494,
        //% block="C5"
        C5 = 523,
    }

    /////////////////////// DigitalTubes ///////////////////////
    let PINDIO = DigitalPin.P1;
    let PINCLK = DigitalPin.P2;

    let CMD_SYSTEM_CONFIG = 0x48   
    let DIG1_ADDRESS = 0x68
    let DIG2_ADDRESS = 0x6A
    let DIG3_ADDRESS = 0x6C
    let DIG4_ADDRESS = 0x6E
    let DatAddressArray = [DIG1_ADDRESS, DIG2_ADDRESS, DIG3_ADDRESS, DIG4_ADDRESS];

    let _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];
    let _intensity = 8
    let dbuf = [0, 0, 0, 0]
    /////////////////////// DigitalTubes ///////////////////////
    
    function clamp(value: number, min: number, max: number): number {
        return Math.max(Math.min(max, value), min);
    }

    /**
     * Set RGB LED color
     * @param color the color to set, eg: GooBit.LEDColor.Red
     */
    //% weight=85
    //% blockId=GooBit_setRGBLED_color block="set RGB LED color to %color"
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=4
    export function setRGBLED_color(color: LEDColor): void {
        pins.digitalWritePin(rgbLEDPin, 1);
        pins.analogWritePin(rgbLEDPin, color as number);
    }

    /**
     * Set RGB LED brightness
     * @param brightness the brightness (0-255), eg: 128
     */
    //% weight=84
    //% blockId=GooBit_setRGBLED_brightness block="set RGB LED brightness to %brightness"
    //% brightness.min=0 brightness.max=255
    export function setRGBLED_brightness(brightness: number): void {
        rgbLEDBrightness = clamp(brightness, 0, 255);
        pins.analogWritePin(rgbLEDPin, rgbLEDBrightness);
    }

    /**
     * Turn off RGB LED
     */
    //% weight=83
    //% blockId=GooBit_RGB_off block="turn off RGB LED"
    export function RGB_off(): void {
        pins.digitalWritePin(rgbLEDPin, 0);
    }

    /**
     * Set RGB LED to custom color using RGB values
     * @param red the red value (0-255), eg: 255
     * @param green the green value (0-255), eg: 0
     * @param blue the blue value (0-255), eg: 0
     */
    //% weight=82
    //% blockId=GooBit_setRGBLED_RGB block="set RGB LED R %red|G %green|B %blue"
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% inlineInputMode=inline
    export function setRGBLED_RGB(red: number, green: number, blue: number): void {
        let color = ((clamp(red, 0, 255) << 16) | (clamp(green, 0, 255) << 8) | clamp(blue, 0, 255));
        pins.digitalWritePin(rgbLEDPin, 1);
        pins.analogWritePin(rgbLEDPin, color);
    }

    /**
     * Play a tone on the buzzer
     * @param frequency frequency in Hz, eg: 262
     * @param duration duration in milliseconds, eg: 500
     */
    //% weight=81
    //% blockId=GooBit_playTone block="play tone frequency %frequency|duration %duration ms"
    //% frequency.min=20 frequency.max=20000
    //% duration.min=0 duration.max=60000
    //% inlineInputMode=inline
    export function playTone(frequency: number, duration: number): void {
        pins.tone(buzzerPin, frequency, duration);
    }

    /**
     * Play a note on the buzzer
     * @param note musical note, eg: GooBit.BuzzerNote.C
     * @param duration duration in milliseconds, eg: 500
     */
    //% weight=80
    //% blockId=GooBit_playNote block="play note %note|for %duration ms"
    //% duration.min=0 duration.max=60000
    export function playNote(note: BuzzerNote, duration: number): void {
        pins.tone(buzzerPin, note as number, duration);
    }

    /**
     * Stop buzzer
     */
    //% weight=79
    //% blockId=GooBit_stopBuzzer block="stop buzzer"
    export function stopBuzzer(): void {
        pins.tone(buzzerPin, 0, 0);
    }

    /**
     * Set the direction and speed of GooBit motor.
     * @param index motor MA/MB/all. eg: GooBit.Motors.MAll
     * @param direction direction to turn. eg: GooBit.Dir.CW
     * @param speed speed of motors (0 to 255). eg: 120
     */
    //% weight=90
    //% blockId=GooBit_MotorRun block="motor|%index|move|%direction|at speed|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        if (index > 2 || index < 0)
            return

        let dir_ma = direction == Dir.CW ? Dir.CCW : Dir.CW;
        speed = clamp(speed, 0, 255) * 4.01;  // 0~255 > 0~1023

        if (index == Motors.MA) {
            pins.digitalWritePin(GooBitMotorADIR, dir_ma);
            pins.analogWritePin(GooBitMotorAPWM, speed);
        } else if (index == Motors.MB) {
            pins.digitalWritePin(GooBitMotorBDIR, direction);
            pins.analogWritePin(GooBitMotorBPWM, speed);
        } else if (index == Motors.MAll) {
            pins.digitalWritePin(GooBitMotorADIR, dir_ma);
            pins.analogWritePin(GooBitMotorAPWM, speed);
            pins.digitalWritePin(GooBitMotorBDIR, direction);
            pins.analogWritePin(GooBitMotorBPWM, speed);
        }
    }

    /**
     * Stop the GooBit motor.
     * @param motor motor m1/m2/all. eg: GooBit.Motors.MAll
     */
    //% weight=78
    //% blockId=GooBit_motorStop block="motor |%motor stop"
    //% motor.fieldEditor="gridpicker" motor.fieldOptions.columns=2 
    export function motorStop(motor: Motors): void {
        motorRun(motor, 0, 0);
    }

    /**
     * Stop all motors
     */
    //% weight=77
    //% blockId=GooBit_stopAll block="stop all motors"
    export function stopAll(): void {
        motorStop(Motors.MAll);
    }

    /**
     * Set motor speed for MA and MB separately
     * @param speedA speed of motor MA (0 to 255), eg: 128
     * @param directionA direction of motor MA, eg: GooBit.Dir.CW
     * @param speedB speed of motor MB (0 to 255), eg: 128
     * @param directionB direction of motor MB, eg: GooBit.Dir.CW
     */
    //% weight=76
    //% blockId=GooBit_motorRunDual block="motor MA|%directionA|speed|%speedA| MB|%directionB|speed|%speedB"
    //% speedA.min=0 speedA.max=255
    //% speedB.min=0 speedB.max=255
    //% directionA.fieldEditor="gridpicker" directionA.fieldOptions.columns=2
    //% directionB.fieldEditor="gridpicker" directionB.fieldOptions.columns=2
    //% inlineInputMode=inline
    export function motorRunDual(directionA: Dir, speedA: number, directionB: Dir, speedB: number): void {
        motorRun(Motors.MA, directionA, speedA);
        motorRun(Motors.MB, directionB, speedB);
    }

    /**
     * Move GooBit with speed.
     * @param speed the speed from 0 (min) to 255 (max), eg:128
     * @param dir move direction, eg: GooBit.CarMoving.TForward
     */
    //% weight=75
    //% blockId=GooBit_Moving block="moving with speed %speed |%dir"
    //% speed.min=0 speed.max=255
    export function Moving(speed: number, dir:CarMoving): void {
        if(dir == CarMoving.TForward){
            motorRun(Motors.MAll, 0, speed);
        } else if(dir == CarMoving.TBack){
            motorRun(Motors.MAll, 1, speed);
        } else if(dir == CarMoving.TLeft){
            motorRun(Motors.MA, 0, speed);
            motorRun(Motors.MB, 0, speed/2);
        } else if(dir == CarMoving.TRight){
            motorRun(Motors.MA, 0, speed/2);
            motorRun(Motors.MB, 0, speed);
        } else if(dir == CarMoving.TLeftRotate){
            motorRun(Motors.MA, 0, speed);
            motorRun(Motors.MB, 1, speed);
        } else if(dir == CarMoving.TRightRotate){
            motorRun(Motors.MA, 1, speed);
            motorRun(Motors.MB, 0, speed);
        } else{
            // nothing
        }
    }

    /**
     * Move forward with specified speed
     * @param speed speed (0 to 255), eg: 200
     */
    //% weight=74
    //% blockId=GooBit_moveForward block="move forward at speed %speed"
    //% speed.min=0 speed.max=255
    export function moveForward(speed: number): void {
        motorRun(Motors.MAll, Dir.CW, speed);
    }

    /**
     * Move backward with specified speed
     * @param speed speed (0 to 255), eg: 200
     */
    //% weight=73
    //% blockId=GooBit_moveBackward block="move backward at speed %speed"
    //% speed.min=0 speed.max=255
    export function moveBackward(speed: number): void {
        motorRun(Motors.MAll, Dir.CCW, speed);
    }

    /**
     * Turn left with specified speed
     * @param speed speed (0 to 255), eg: 150
     */
    //% weight=72
    //% blockId=GooBit_turnLeft block="turn left at speed %speed"
    //% speed.min=0 speed.max=255
    export function turnLeft(speed: number): void {
        motorRun(Motors.MA, Dir.CW, speed);
        motorRun(Motors.MB, Dir.CCW, speed);
    }

    /**
     * Turn right with specified speed
     * @param speed speed (0 to 255), eg: 150
     */
    //% weight=71
    //% blockId=GooBit_turnRight block="turn right at speed %speed"
    //% speed.min=0 speed.max=255
    export function turnRight(speed: number): void {
        motorRun(Motors.MA, Dir.CCW, speed);
        motorRun(Motors.MB, Dir.CW, speed);
    }

    /**
     * Read analog value from pin
     * @param pin analog pin to read, eg: AnalogPin.P0
     */
    //% weight=70
    //% blockId=GooBit_readAnalog block="read analog pin %pin"
    export function readAnalog(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }

    /**
     * Read digital value from pin
     * @param pin digital pin to read, eg: DigitalPin.P0
     */
    //% weight=69
    //% blockId=GooBit_readDigital block="read digital pin %pin"
    export function readDigital(pin: DigitalPin): number {
        return pins.digitalReadPin(pin);
    }

    /**
     * Get temperature in celsius
     */
    //% weight=68
    //% blockId=GooBit_getTemperature block="temperature (°C)"
    export function getTemperature(): number {
        return input.temperature();
    }

    /**
     * Get light level (0-255)
     */
    //% weight=67
    //% blockId=GooBit_getLightLevel block="light level"
    export function getLightLevel(): number {
        return input.lightLevel();
    }

    /**
      * Enable or Disable line tracking sensor and set the line tracking sensor valve value.
      * @param enable line tracking sensor enable signal(0 or 1), eg: GooBit.TrackEnable.TrackOn
      * @param lightValve  line tracking sensor light valve value(0 ~ 511), eg: 400
      * @param darkValve line tracking sensor dark valve value(512 ~ 1023), eg: 600
      */
    //% weight=66
    //% blockId=GooBit_enableTrack_setValveValue block="%enable line tracking sensor and set valve value light |%lightValve| dark |%darkValve|"
    //% enable.fieldEditor="gridpicker" enable.fieldOptions.columns=2 
    //% lightValve.min=0 lightValve.max=511
    //% darkValve.min=512 darkValve.max=1023
    //% inlineInputMode=inline
    export function enableTrack_setValveValue(enable: TrackEnable, lightValve: number, darkValve: number): void {
        pins.digitalWritePin(GooBitTrackENPin, enable)
        GooBitLightValveVal = lightValve
        GooBitDarkValveVal = darkValve
    }

    /**
      * Read line tracking sensor.
      * @param trackNum track sensor number.
      */
    //% weight=65
    //% blockId=GooBit_readTrackSensor block="read %trackNum line tracking sensor"
    //% trackNum.fieldEditor="gridpicker" trackNum.fieldOptions.columns=3
    export function readTrackSensor(trackNum: Track): number {
        if (trackNum == Track.TrackLeft) {
            return pins.analogReadPin(GooBitTrackLeft)
        } else if (trackNum == Track.TrackMiddle) {
            return pins.analogReadPin(GooBitTrackMiddle)
        } else if (trackNum == Track.TrackRight) {
            return pins.analogReadPin(GooBitTrackRight)
        } else {
            return -1
        }
    }

    /**
	* Judging the Current Status of Tracking Module. 
	* @param state Five states of tracking module, eg: GooBit.TrackingState.M_line_LR_unline
    */
    //% blockId=GooBit_tracking block="Tracking state is %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=3
    //% state.fieldOptions.tooltips="false"
    //% weight=64
    export function tracking(state: TrackingState): boolean {
        let left_tracking = readTrackSensor(Track.TrackLeft);
        let middle_tracking = readTrackSensor(Track.TrackMiddle);
        let right_tracking = readTrackSensor(Track.TrackRight);
        if (left_tracking <= GooBitLightValveVal && middle_tracking >= GooBitDarkValveVal && right_tracking <= GooBitLightValveVal  && state == TrackingState.M_line_LR_unline) {
            return true;
        } else if (left_tracking <= GooBitLightValveVal && right_tracking >= GooBitDarkValveVal && state == TrackingState.L_unline_M_unknow_R_line) {
            return true;
        } else if (left_tracking >= GooBitDarkValveVal && right_tracking <= GooBitLightValveVal && state == TrackingState.L_line_M_unknow_R_unline) {
            return true;
        } else if (left_tracking <= GooBitLightValveVal && middle_tracking <= GooBitLightValveVal && right_tracking <= GooBitLightValveVal && state == TrackingState.M_L_R_unline) {
            return true;
        } else if (left_tracking >= GooBitDarkValveVal && middle_tracking >= GooBitDarkValveVal && right_tracking >= GooBitDarkValveVal && state == TrackingState.M_L_R_line) {
            return true;
        } else {
            return false;
        }
    }
    /**
    * track one side
    * @param side Line sensor edge , eg: Track.TrackLeft
    * @param state Line sensor status, eg: MbEvents.FindLine
    */
    //% blockId=GooBit_trackSide block="%side line sensor %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=3
    //% weight=62
    export function trackSide(side: Track, state: MbEvents): boolean {
        let left_tracking = readTrackSensor(Track.TrackLeft);
        let middle_tracking = readTrackSensor(Track.TrackMiddle);
        let right_tracking = readTrackSensor(Track.TrackRight);
        if (side == Track.TrackLeft && state == MbEvents.FindLine && left_tracking >= GooBitDarkValveVal) {
            return true;
        } else if (side == Track.TrackLeft && state == MbEvents.LoseLine && left_tracking <= GooBitLightValveVal) {
            return true;
        } else if (side == Track.TrackMiddle && state == MbEvents.FindLine && middle_tracking >= GooBitDarkValveVal) {
            return true;
        } else if (side == Track.TrackMiddle && state == MbEvents.LoseLine && middle_tracking <= GooBitLightValveVal) {
            return true;
        } else if (side == Track.TrackRight && state == MbEvents.FindLine && right_tracking >= GooBitDarkValveVal) {
            return true;
        } else if (side == Track.TrackRight && state == MbEvents.LoseLine && right_tracking <= GooBitLightValveVal) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param maxCmDistance maximum distance in centimeters (default is 450)
     */
    //% weight=61
    //% blockId=GooBit_sonar_ping block="Ultrasonic unit:cm"
    //% inlineInputMode=inline
    export function ping(maxCmDistance = 450): number {
        let d
        // send pulse
        pins.setPull(GooBitUltrasonicTrig, PinPullMode.PullNone);
        pins.digitalWritePin(GooBitUltrasonicTrig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(GooBitUltrasonicTrig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(GooBitUltrasonicTrig, 0);

        // read pulse
        d = pins.pulseIn(GooBitUltrasonicEcho, PulseValue.High, maxCmDistance * 58);
        // d = pins.pulseIn(GooBitUltrasonicEcho, PulseValue.High);

        let distance_ult = d * 0.0346 / 2

        if (distance_ult <= 0 || distance_ult > 450) {
            distance_ult = 0
        }

        // filter timeout spikes
        if (distance_ult == 0 && GooBit_distanceBuf != 0) {
            distance_ult = GooBit_distanceBuf;
        }
        GooBit_distanceBuf = distance_ult;

        return Math.round(distance_ult);

        // switch (unit) {
        //     case PingUnit.Centimeters: return Math.round(distance_ult);
        //     case PingUnit.Inches: return Math.idiv(distance_ult, 148);
        //     default: return Math.idiv(distance_ult, 2.54);
        // }
    }
    
    /**
     * Set servo angle on pin
     * @param pin servo pin, eg: AnalogPin.P1
     * @param angle servo angle (0-180), eg: 90
     */
    //% weight=60
    //% blockId=GooBit_servoSetAngle block="set servo on pin %pin|angle %angle"
    //% angle.min=0 angle.max=180
    export function servoSetAngle(pin: AnalogPin, angle: number): void {
        pins.servoWritePin(pin, clamp(angle, 0, 180));
    }

    /**
     * Rotate servo gradually
     * @param pin servo pin, eg: AnalogPin.P1
     * @param startAngle starting angle (0-180), eg: 0
     * @param endAngle ending angle (0-180), eg: 180
     * @param delayMs delay between steps in milliseconds, eg: 10
     */
    //% weight=59
    //% blockId=GooBit_servoRotate block="rotate servo on pin %pin|from %startAngle|to %endAngle|step %delayMs ms"
    //% startAngle.min=0 startAngle.max=180
    //% endAngle.min=0 endAngle.max=180
    //% delayMs.min=1 delayMs.max=100
    export function servoRotate(pin: AnalogPin, startAngle: number, endAngle: number, delayMs: number): void {
        let angle = startAngle;
        let step = endAngle > startAngle ? 1 : -1;
        while ((step > 0 && angle <= endAngle) || (step < 0 && angle >= endAngle)) {
            pins.servoWritePin(pin, angle);
            basic.pause(delayMs);
            angle += step;
        }
    }

    /**
     * Get battery voltage level
     */
    //% weight=58
    //% blockId=GooBit_batteryVoltage block="battery voltage"
    export function batteryVoltage(): number {
        return pins.analogReadPin(AnalogPin.VREF);
    }
    
    /////////////////////// IR ///////////////////////
    function pushBit(bit: number): number {
        irState.bitsReceived += 1;
        if (irState.bitsReceived <= 8) {
            // ignore all address bits
            if (irState.protocol === IrProtocol.Keyestudio && bit === 1) {
                // recover from missing message bits at the beginning
                // Keyestudio address is 0 and thus missing bits can be easily detected
                // by checking for the first inverse address bit (which is a 1)
                irState.bitsReceived = 9;
            }
            return IR_INCOMPLETE;
        }
        if (irState.bitsReceived <= 16) {
            // ignore all inverse address bits
            return IR_INCOMPLETE;
        } else if (irState.bitsReceived < 24) {
            irState.commandBits = (irState.commandBits << 1) + bit;
            return IR_INCOMPLETE;
        } else if (irState.bitsReceived === 24) {
            irState.commandBits = (irState.commandBits << 1) + bit;
            return irState.commandBits & 0xff;
        } else {
            // ignore all inverse command bits
            return IR_INCOMPLETE;
        }
    }

    function detectCommand(markAndSpace: number): number {
        if (markAndSpace < 1600) {
            // low bit
            return pushBit(0);
        } else if (markAndSpace < 2700) {
            // high bit
            return pushBit(1);
        }

        irState.bitsReceived = 0;

        if (markAndSpace < 12500) {
            // Repeat detected
            return IR_REPEAT;
        } else if (markAndSpace < 14500) {
            // Start detected
            return IR_INCOMPLETE;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function enableIrMarkSpaceDetection(pin: DigitalPin) {
        pins.setPull(pin, PinPullMode.PullNone);

        let mark = 0;
        let space = 0;

        pins.onPulsed(pin, PulseValue.Low, () => {
            // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
            mark = pins.pulseDuration();
        });

        pins.onPulsed(pin, PulseValue.High, () => {
            // LOW
            space = pins.pulseDuration();
            const command = detectCommand(mark + space);
            if (command !== IR_INCOMPLETE) {
                control.raiseEvent(MICROBIT_MAKERBIT_IR_NEC, command);
            }
        });
    }

    /**
     * Connects to the IR_Receiver module at the specified pin and configures the IR protocol.
     * @param pin IR_Receiver pin. eg: DigitalPin.P5
     * @param protocol IR protocol. eg: GooBit.IrProtocol.NEC
     */
    //% subcategory="IR_Receiver"
    //% blockId="GooBit_infrared_connect_receiver"
    //% block="connect IR_Receiver at pin %pin and decode %protocol"
    //% pin.fieldEditor="gridpicker"
    //% pin.fieldOptions.columns=4
    //% pin.fieldOptions.tooltips="false"
    //% weight=15
    export function connectIrReceiver(pin: DigitalPin, protocol=IrProtocol.NEC): void {
        if (irState) {
            return;
        }

        irState = {
            protocol: protocol,
            bitsReceived: 0,
            commandBits: 0,
            command: IrButton.Any,
            hasNewCommand: false,
        };

        enableIrMarkSpaceDetection(pin);

        let activeCommand = IR_INCOMPLETE;
        let repeatTimeout = 0;
        const REPEAT_TIMEOUT_MS = 120;

        control.onEvent(
            MICROBIT_MAKERBIT_IR_NEC,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                const necValue = control.eventValue();

                // Refresh repeat timer
                if (necValue <= 255 || necValue === IR_REPEAT) {
                    repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
                }

                // Process a new command
                if (necValue <= 255 && necValue !== activeCommand) {
                    if (activeCommand >= 0) {
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                    }

                    irState.hasNewCommand = true;
                    irState.command = necValue;
                    activeCommand = necValue;
                    control.raiseEvent(MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID, necValue);
                }
            }
        );

        control.inBackground(() => {
            while (true) {
                if (activeCommand === IR_INCOMPLETE) {
                    // sleep to save CPU cylces
                    basic.pause(2 * REPEAT_TIMEOUT_MS);
                } else {
                    const now = input.runningTime();
                    if (now > repeatTimeout) {
                        // repeat timed out
                        control.raiseEvent(
                            MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                        activeCommand = IR_INCOMPLETE;
                    } else {
                        basic.pause(REPEAT_TIMEOUT_MS);
                    }
                }
            }
        });
    }

    /**
     * Do something when a specific button is pressed or released on the remote control.
     * @param button the button to be checked
     * @param action the trigger action
     * @param handler body code to run when event is raised
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_on_ir_button
    //% block="on IR button | %button | %action"
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% weight=13
    export function onIrButton(button: IrButton, action: IrButtonAction, handler: () => void) {
        control.onEvent(
            action === IrButtonAction.Pressed
                ? MICROBIT_MAKERBIT_IR_BUTTON_PRESSED_ID
                : MICROBIT_MAKERBIT_IR_BUTTON_RELEASED_ID,
            button === IrButton.Any ? EventBusValue.MICROBIT_EVT_ANY : button,
            () => {
                irState.command = control.eventValue();
                handler();
            }
        );
    }

    /**
     * Returns the code of the IR button that was pressed last. Returns -1 (IrButton.Any) if no button has been pressed yet.
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_ir_button_pressed
    //% block="IR button"
    //% weight=10
    export function irButton(): number {
        if (!irState) {
            return IrButton.Any;
        }
        return irState.command;
    }

    /**
     * Returns true if any button was pressed since the last call of this function. False otherwise.
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_was_any_button_pressed
    //% block="any IR button was pressed"
    //% weight=7
    export function wasAnyIrButtonPressed(): boolean {
        if (!irState) {
            return false;
        }
        if (irState.hasNewCommand) {
            irState.hasNewCommand = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns the command code of a specific IR button.
     * @param button the button
     */
    //% subcategory="IR_Receiver"
    //% blockId=GooBit_infrared_button_code
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% block="IR button code %button"
    //% weight=5
    export function irButtonCode(button: IrButton): number {
        return button as number;
    }
    /////////////////////// IR ///////////////////////
}
