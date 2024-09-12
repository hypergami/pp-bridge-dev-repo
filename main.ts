function uART2Pins (stringData: string) {
    if (stringData == "p0U") {
        pins.digitalWritePin(DigitalPin.P0, 1)
        bluetooth.uartWriteString("p0U")
    } else if (stringData == "p0D") {
        pins.digitalWritePin(DigitalPin.P0, 0)
        bluetooth.uartWriteString("p0D")
    } else if (stringData == "p1U") {
        pins.digitalWritePin(DigitalPin.P1, 1)
        bluetooth.uartWriteString("p1U")
    } else if (stringData == "p1D") {
        pins.digitalWritePin(DigitalPin.P1, 0)
        bluetooth.uartWriteString("p1D")
    } else if (stringData == "p2U") {
        pins.digitalWritePin(DigitalPin.P2, 1)
        bluetooth.uartWriteString("p2U")
    } else if (stringData == "p2D") {
        pins.digitalWritePin(DigitalPin.P2, 0)
        bluetooth.uartWriteString("p2D")
    } else if (stringData == "p9U") {
        pins.digitalWritePin(DigitalPin.P9, 1)
        bluetooth.uartWriteString("p9U")
    } else if (stringData == "p9D") {
        pins.digitalWritePin(DigitalPin.P9, 0)
        bluetooth.uartWriteString("p9D")
    } else if (stringData == "p13D") {
        pins.digitalWritePin(DigitalPin.P13, 0)
        bluetooth.uartWriteString("p13D")
    } else if (stringData == "p13U") {
        pins.digitalWritePin(DigitalPin.P13, 1)
        bluetooth.uartWriteString("p13U")
    } else {
    	
    }
}
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Dollar), function () {
    dataReceived = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Pipe)).split("$")
    UARTString = dataReceived.pop()
    if (UARTString.includes("p0") || UARTString.includes("p1") || UARTString.includes("p2")) {
        uART2Pins(UARTString)
    } else if (UARTString == "success" || UARTString == "failure") {
        uART2RatioSuccess(UARTString)
    } else if (UARTString.includes("angle")) {
        dataReceived = UARTString.split(":")
        UARTString = dataReceived.pop()
        uART2Servo(UARTString)
    } else if (UARTString.includes("speed")) {
        dataReceived = UARTString.split(":")
        UARTString = dataReceived.pop()
        uART2ContinuousServo(UARTString)
    } else {
        uART2LEDMatrix(UARTString)
    }
})
function uART2RatioSuccess (stringData: string) {
    if (stringData == "success") {
        basic.showIcon(IconNames.Happy)
    } else if (stringData == "failure") {
        basic.showIcon(IconNames.Sad)
    }
}
// send values from 0-180
function uART2ContinuousServo (stringData: string) {
    basic.showIcon(IconNames.SmallSquare)
    servos.P1.run(parseFloat(stringData))
}
bluetooth.onBluetoothConnected(function () {
    basic.showLeds(`
        # . # # .
        . # # . #
        . . # # .
        . # # . #
        # . # # .
        `)
    basic.pause(2000)
    basic.clearScreen()
})
bluetooth.onBluetoothDisconnected(function () {
    for (let index = 0; index < 3; index++) {
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
        basic.pause(100)
        basic.showLeds(`
            # . # # .
            . # # . #
            . . # # .
            . # # . #
            # . # # .
            `)
        basic.pause(100)
    }
    basic.clearScreen()
})
function uART2LEDMatrix (stringData: string) {
    if (stringData == "happy") {
        basic.showIcon(IconNames.Happy)
    } else if (stringData == "sad") {
        basic.showIcon(IconNames.Sad)
    } else if (stringData == "heart") {
        basic.showIcon(IconNames.Heart)
    } else if (stringData == "bird") {
        basic.showIcon(IconNames.Duck)
    } else if (stringData == "ghost") {
        basic.showIcon(IconNames.Ghost)
    } else if (stringData == "house") {
        basic.showIcon(IconNames.House)
    }
}
// send values from 0-180
function uART2Servo (stringData: string) {
    basic.showIcon(IconNames.Meh)
    servos.P0.setAngle(parseFloat(stringData))
}
let UARTString = ""
let dataReceived: string[] = []
bluetooth.startUartService()
bluetooth.startAccelerometerService()
bluetooth.startButtonService()
bluetooth.startIOPinService()
bluetooth.startLEDService()
bluetooth.startTemperatureService()
bluetooth.startMagnetometerService()
basic.showIcon(IconNames.Yes)
