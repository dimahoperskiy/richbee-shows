import React, {useEffect, useState} from "react"
import style from "./Info.module.css"
import {NavLink, withRouter} from "react-router-dom"
import api from "../../api/api";
import search from "./search.svg"
import Similar from "../similar/Similar";

const Info = (props) => {
    const [images, setImages] = useState([])
    const [film, setFilm] = useState({})
    const [isSending, setIsSending] = useState(false)
    const [similar, setSimilar] = useState([])
    const [inputValue, setInputValue] = useState("")


    let valueChanged = (e) => {
        setInputValue(e.target.value)
    }

    useEffect(() => {
        let id = props.match.params.id
        setIsSending(true)
        api.getOverviewDetails(id)
            .then(data => {
                let obj = {}
                if (data.ratings.otherRanks) {
                    let rating = data.ratings.otherRanks[0]
                    obj.otherRating = {
                        label: rating.label,
                        rank: rating.rank
                    }
                }
                obj.title = data.title.title
                obj.titleType = data.title.titleType
                obj.year = data.title.year
                data.genres ? obj.genre = data.genres[0] : obj.genre = "?"
                obj.rating = data.ratings.rating
                api.getImages(id)
                    .then(data => {
                        setImages(data.images)
                        api.getRatings(id)
                            .then(data => {
                                let win = 0
                                let lose = 0
                                let globe = 0
                                let awards = data.resource.awards
                                if (awards) {
                                    awards.forEach(el => {
                                        if (el.isWinner) {
                                            if (el.awardName === "Golden Globe") globe++
                                            else win++
                                        } else lose++
                                    })
                                }
                                obj.globes = globe
                                obj.wins = win
                                obj.loses = lose
                                console.log(id)
                                api.getPlots(id)
                                    .then(data => {
                                        let max = 0
                                        let max_id = -1
                                        let cnt = 0
                                        if (data.plots) {
                                            data.plots.forEach(el => {
                                                if (el.text.length > max) {
                                                    max = el.text.length
                                                    max_id = cnt
                                                }
                                                cnt++
                                            })
                                        }
                                        if (data.plots[max_id]) obj.plot = data.plots[max_id].text
                                        else obj.plot = "No description"
                                        api.getSimilar(id)
                                            .then(data => {
                                                let sim = []
                                                let cnt = 1
                                                data.forEach(el => {
                                                    api.getOverviewDetails(el.slice(7, -1))
                                                        .then(data1 => {
                                                            sim.push(data1)
                                                            console.log(cnt, data.length)

                                                            if (cnt === data.length) {
                                                                setSimilar(sim)
                                                                setFilm(obj)
                                                                setIsSending(false)
                                                            }
                                                            cnt++
                                                        })
                                                })
                                            })
                                    })
                            })
                    })

            })
    }, [props.match.params.id])

    let similarAll = similar.map(el => <Similar {...el}/>)

    console.log(similar)

    return (
        <>
            <div className={style.wrapper}>
                <div className={style.nav}>
                    <NavLink to="/" className={style.linkHome}>
                        <h1>Richbee Shows</h1>
                    </NavLink>
                    <div className={style.input}>
                        <input placeholder="Type here smth..." type="text" onChange={valueChanged}/>
                        <NavLink to={`/home/${inputValue}`}><img src={search} alt="search"/></NavLink>
                    </div>
                </div>
                {isSending ?
                    <div className={style.empty}/>
                    :
                    <div className={style.info}>
                        <div className={style.inner}>
                            <h1>{film.title}</h1>
                            <div className={style.smallInfo}>
                                <div className={style.rating}>
                                    <p>IMDb {film.rating || "?"}</p>
                                </div>
                                <p>{film.genre}</p>
                                <p>|</p>
                                <p>{film.titleType}</p>
                                <p>|</p>
                                <p>{film.year}</p>
                            </div>
                            <a className={style.watchBtn} href="#" onClick={() => alert("К сожалению я не смог найти ссылку на трейлер из их апишки 😔")}>Watch</a>
                            <div className={style.awards}>
                                <p>{film.otherRating ? film.otherRating.label : ""}
                                    #{film.otherRating ? film.otherRating.rank : ""}</p>
                                <p>|</p>
                                <p>Won {film.globes} Golden Globes</p>
                            </div>
                            <p className={style.lastP}>Another {film.wins} wins & {film.loses} nominations</p>
                        </div>
                        <img className={style.bgImg} src={images[0] ? images[0].url : ""} alt=""/>
                        <div className={style.shadow}/>
                    </div>
                }

            </div>
            <div className={style.tail}>
                <div className={style.content}>
                    <h1>Watch {film.title} on Richbee Shows</h1>
                    <p>{film.plot}</p>
                    <h2>You may also like</h2>
                    <div className={style.similar}>
                        {similarAll}
                    </div>
                </div>
            </div>
            <div className={style.footer}>
                <h3>Richbee Shows</h3>
            </div>
        </>
    )
}


export default withRouter(Info)