import ZSensorEvent from '../ZSensorEvent'

export class MoveRight extends ZSensorEvent {
    static type = 'move:right'
}

export class MoveLeft extends ZSensorEvent {
    static type = 'move:left'
}
