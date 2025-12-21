/**
 * MakeCode micro:bit type definitions
 * This file provides type definitions for the MakeCode micro:bit environment
 */

declare enum DigitalPin {
    P0 = 0,
    P1 = 1,
    P2 = 2,
    P3 = 3,
    P4 = 4,
    P5 = 5,
    P6 = 6,
    P7 = 7,
    P8 = 8,
    P9 = 9,
    P10 = 10,
    P11 = 11,
    P12 = 12,
    P13 = 13,
    P14 = 14,
    P15 = 15,
    P16 = 16,
    P19 = 19,
    P20 = 20,
}

declare enum AnalogPin {
    P0 = 0,
    P1 = 1,
    P2 = 2,
    P3 = 3,
    P4 = 4,
    P5 = 5,
    P6 = 6,
    P7 = 7,
    P8 = 8,
    P9 = 9,
    P10 = 10,
    P11 = 11,
    P12 = 12,
    P13 = 13,
    P14 = 14,
    P15 = 15,
    P16 = 16,
    P19 = 19,
    P20 = 20,
    MIC = 128,
    VREF = 129,
}

declare enum PinPullMode {
    PullNone = 0,
    PullDown = 1,
    PullUp = 2,
}

declare enum PulseValue {
    High = 1,
    Low = 0,
}

declare enum EventBusValue {
    MICROBIT_EVT_ANY = 0,
}

declare namespace pins {
    function digitalReadPin(pin: DigitalPin): number;
    function digitalWritePin(pin: DigitalPin, value: number): void;
    function analogReadPin(pin: AnalogPin): number;
    function analogWritePin(pin: AnalogPin, value: number): void;
    function setPull(pin: DigitalPin, pull: PinPullMode): void;
    function pulseIn(pin: DigitalPin, value: PulseValue, maxDuration?: number): number;
    function pulseDuration(): number;
    function onPulsed(pin: DigitalPin, pulse: PulseValue, handler: () => void): void;
    function servoWritePin(pin: AnalogPin, value: number): void;
    function tone(pin: DigitalPin, frequency: number, duration: number): void;
}

declare namespace input {
    function temperature(): number;
    function lightLevel(): number;
    function runningTime(): number;
}

declare namespace control {
    function waitMicros(micros: number): void;
    function raiseEvent(src: number, value: number): void;
    function eventValue(): number;
    function onEvent(src: number, value: number, handler: () => void): void;
    function inBackground(handler: () => void): void;
}

declare namespace basic {
    function pause(ms: number): void;
}
