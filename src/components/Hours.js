import React from 'react'


const Hours = props => {

    let hour = new Date(props.element.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    
    return (
        <div className="nextHours-tab">
            <div className="nextHours-hour">{hour}</div>
            <img className="nextHours-img" alt="icon" src={props.setIcon(props.element.icon)}></img>
            <div className="nextHours-temp">{props.element.temp}°</div>
        </div>


    )
}

export default Hours
