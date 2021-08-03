import React from 'react'

const Days = props => {

    const weekDay = () => {
        let today = new Date()
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const iter = props.element.dayInRow
        const day = ((today.getDay() + iter) > 6 ? weekDays[today.getDay() + iter - 7] : weekDays[today.getDay() + iter])
        return day
    }

    const extendedHandler = () => props.extendedHandler(props.element.dayInRow)

    return (
        <div onClick={extendedHandler} className="nextDay-tab">
            <div className="nextDay-temp">{props.element.temp}°</div>
            <div className="nextDay-weekDay">{weekDay()}</div>
            <img className={`${props.element.extended ? 'nextDay-img-extended' : 'nextDay-img'}`} alt="banan" src={props.setIcon(props.element.icon)}></img>
            <div className={`extendedInfo ${props.element.extended ? '' : 'hide'}`}>
                <div className="extendedInfo-pressure">{props.element.pressure} hPa</div>
                <div className="extendedInfo-humidity">Humidity: {props.element.humidity}%</div>
                <div className="extendedInfo-conditions">{props.element.desc}</div>
                <div className="extendedInfo-tempMM">{props.element.tempMax}° / {props.element.tempMin}°</div>
                <div className="extendedInfo-wind">Wind speed: {props.element.wind}m/s</div>
            </div>
        </div>
    )
}

export default Days
