import React from 'react'
import Days from './Days';
import Hours from './Hours'
import '../styles/style.css';
import { AiFillCaretRight } from 'react-icons/ai';
import { AiFillCaretUp } from 'react-icons/ai';

// icons
import cloudy from '../img/cloudy.png';
import cloudyN from '../img/cloudyN.png';
import moon from '../img/moon.png';
import cloud from '../img/cloud.png';
import sunny from '../img/sunny.png';
import rain from '../img/rain.png';
import storm from '../img/storm.png';
import snow from '../img/snow.png';
import fog from '../img/fog.png';

class Weather extends React.Component {

    state = {
        lat: '',
        lon: '',
        city: '',
        name: '',

        today: {
            sunrise: '',
            sunset: '',
            temp: '',
            pressure: '',
            humidity: '',
            desc: '',
            wind: '',
            conditions: ''
        },

        hourly: [],

        days: [],
        error: false,
        showMore: false
    }

    // get data by location
    componentDidMount() {
        const success = pos => {
            const crd = pos.coords;
            const API = `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=226d028baa8b247b20269ce960d283c6&units=metric`

            fetch(API)
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        name: response.name,
                    })
                })

                .catch(err => {
                    this.setState({ error: err })
                })

            this.setState({
                lat: crd.latitude,
                lon: crd.longitude
            });
            this.getData(crd.latitude, crd.longitude)
        }
        navigator.geolocation.getCurrentPosition(success)

    }

    search = (e) => {
        e.preventDefault()
        this.getCoords()
    }

    handleInputChange = e => {
        this.setState({ city: e.target.value })
    }

    // get coords from search
    getCoords = () => {
        const API = `https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&APPID=226d028baa8b247b20269ce960d283c6&units=metric`

        fetch(API)
            .then(response => {
                if (response.ok) {
                    return response
                }
                throw Error(true)
            })
            .then(response => response.json())
            .then(response => {
                this.getData(response.coord.lat, response.coord.lon)

                this.setState({
                    name: response.name,
                    lon: response.coord.lon,
                    lat: response.coord.lat
                })

            })
            .catch(err => {
                this.setState({ error: err })
            })
    }

    getData = (lat, lon) => {
        const API = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=226d028baa8b247b20269ce960d283c6&units=metric`
        fetch(API)
            .then(response => {
                if (response.ok) {
                    return response
                }
                throw Error(true)
            })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    error: false,
                    showMore: false,
                    today: {
                        sunrise: response.current.sunrise,
                        sunset: response.current.sunset,
                        temp: Math.round(response.current.temp),
                        pressure: response.current.pressure,
                        humidity: response.current.humidity,
                        wind: response.current.wind_speed,
                        desc: response.current.weather[0].description,
                        icon: response.current.weather[0].icon
                    },
                })

                //get daily data
                const clear = []
                this.setState({ days: clear });
                for (let i = 0; i < 6; i++) {
                    let day = {
                        dayInRow: i,
                        temp: Math.round(response.daily[i].temp.day),
                        desc: response.daily[i].weather[0].description,
                        tempMin: Math.round(response.daily[i].temp.min),
                        tempMax: Math.round(response.daily[i].temp.max),
                        wind: response.daily[i].wind_speed,
                        UV: response.daily[i].uvi,
                        humidity: response.daily[i].humidity,
                        pressure: response.daily[i].pressure,
                        icon: response.daily[i].weather[0].icon,
                        extended: false
                    }
                    const newDays = [...this.state.days, day]
                    this.setState({ days: newDays });
                }

                // get hourly data
                this.setState({ hourly: clear });
                for (let j = 0; j < 24; j++) {
                    let hour = {
                        hourInRow: j,
                        temp: Math.round(response.hourly[j].temp),
                        icon: response.hourly[j].weather[0].icon,
                        dt: response.hourly[j].dt
                    }

                    const newHours = [...this.state.hourly, hour]
                    this.setState({ hourly: newHours });
                }

                document.title = `${this.state.today.temp}°C • ${this.state.name} • Weather`
            })

            .catch(err => {
                this.setState({ error: err })
                console.log('we cant find this city')
            })
    }

    setIcon = (isNight) => {
        let icon = String(isNight)
        switch (icon) {
            case '01d': return sunny
            case '01n': return moon
            case '02d': return cloudy
            case '02n': return cloudyN
            case '03d': case '04d': case '03n': case '04n': return cloud
            case '09d': case '09n': case '10d': case '10n': return rain
            case '11d': case '11n': return storm
            case '13d': case '13n': return snow
            case '50d': case '50n': return fog

            default: return null
        }
    }

    showMoreDays = () => {
        this.setState({ showMore: !this.state.showMore });
    }

    extendedHandler(dayInRow) {
        const index = this.state.days.findIndex(x => x.dayInRow === dayInRow)
        const newDays = this.state.days
        newDays[index].extended = !this.state.days[index].extended
        this.setState({ days: newDays })
    }

    currentDate = () => {
        let today = new Date()
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const hour = (String(today.getHours()).length === 2 ? String(today.getHours()) : '0' + String(today.getHours()))
        const minutes = (String(today.getMinutes()).length === 2 ? String(today.getMinutes()) : '0' + String(today.getMinutes()))
        const day = weekDays[today.getDay()]
        return day + ', ' + hour + ':' + minutes
    }

    // horizontalScroll = (event) => {
    //     const delta = Math.max(-1, Math.min(1, (event.nativeEvent.wheelDelta || -event.nativeEvent.detail)))
    //     event.currentTarget.scrollLeft = event.currentTarget.scrollLeft - (delta * 90)
    //     event.preventDefault()
    // }

    // onWheel = (e) => {
    //     e.preventDefault()
    //     let container = document.getElementById('hours')
    //     let containerScrollPosition = document.getElementById('hours').scrollLeft
    //     container.scrollTo({
    //         top: 0,
    //         left: containerScrollPosition + e.deltaY,
    //         behaviour: 'smooth' //if you want smooth scrolling
    //     })
    // }


    render() {
        const lastDays = this.state.days.map(e => {
            return <Days
                key={e.dayInRow}
                setIcon={this.setIcon}
                extendedHandler={this.extendedHandler.bind(this)}
                element={e} />
        })

        const hours = this.state.hourly.map(e => {
            return <Hours
                key={e.hourInRow}
                setIcon={this.setIcon}
                element={e} />
        })

        const moreDaysText = (this.state.showMore ? <div> Hide more days <AiFillCaretUp /> </div> : <div> Show more days <AiFillCaretRight /> </div>)
        const kalafior = (this.state.error ? <div> City not found! </div> : '')

        const todayContent = (this.state.name === '' ? <div></div> :

            <div className="mainPage">
                <div className="col1">
                    <div className="header">
                        <div className="city">{this.state.name}</div>
                        <div className="date">{this.currentDate()}</div>
                    </div>
                    <div className="todayInfo">
                        <img className="todayImg" src={this.setIcon(this.state.today.icon)} alt=""></img>
                        <div className="todayTemp">{this.state.today.temp}°</div>
                        <div className="todayConditions">{this.state.today.desc}</div>
                    </div>

                    <div className="todayDetails">
                        <div className="details">
                            <div className="detailsLabel">Pressure</div>
                            <div className="detailsHeader">{this.state.today.pressure} hPa</div>
                        </div>
                        <div className="details">
                            <div className="detailsLabel">Wind speed</div>
                            <div className="detailsHeader">{this.state.today.wind} m/s</div>
                        </div>
                        <div className="details">
                            <div className="detailsLabel">Humidity</div>
                            <div className="detailsHeader">{this.state.today.humidity} %</div>
                        </div>
                    </div>
                </div>

                <div id="hours" onWheel={this.onWheel} className="nextHours">{hours}</div>

                <div className="col2">
                    <div onClick={this.showMoreDays.bind(this)} className="showMore"> {moreDaysText} </div>
                    <div className={`nextDays ${this.state.showMore ? '' : 'hide'}`}>{lastDays}</div>
                </div>
            </div>)

        return (
            <div>
                <div className="header">
                    <form>
                        <input placeholder="Search city" onChange={this.handleInputChange.bind(this)} type="search"></input>
                        <button onClick={this.search.bind(this)} type="submit"></button>
                    </form>
                    <div className="alert">{kalafior}</div>
                </div>

                <div>{todayContent}</div>
            </div>
        )
    }
}

export default Weather