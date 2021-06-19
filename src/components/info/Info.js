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
        let effect = async () => {
            let id = props.match.params.id
            setIsSending(true)
            let data = await api.getOverviewDetails(id)

            let obj = {}
            if (data.ratings.otherRanks) {
                let rating = data.ratings.otherRanks[0]
                obj.otherRating = {
                    label: rating.label,
                    rank: rating.rank
                }
            }
            [obj.title, obj.titleType, obj.year, obj.rating] =
                [data.title.title, data.title.titleType, data.title.year, data.ratings.rating]
            data.genres ? obj.genre = data.genres[0] : obj.genre = "?"

            let data1 = await api.getImages(id)
            setImages(data1.images)

            let data2 = await api.getRatings(id)

            let [win, lose, globe] = [0, 0, 0]

            let awards = data2.resource.awards
            if (awards) {
                awards.forEach(el => {
                    if (el.isWinner) {
                        if (el.awardName === "Golden Globe") globe++
                        else win++
                    } else lose++
                })
            }
            [obj.globes, obj.wins, obj.loses] = [globe, win, lose]

            let data3 = await api.getPlots(id)

            let [max, max_id, cnt] = [0, -1, 0]

            if (data3.plots) {
                data3.plots.forEach(el => {
                    if (el.text.length > max) {
                        max = el.text.length
                        max_id = cnt
                    }
                    cnt++
                })
            }
            if (data3.plots[max_id]) obj.plot = data3.plots[max_id].text
            else obj.plot = "No description"
            let data4 = await api.getSimilar(id)

            let sim = []
            let cnt1 = 1
            data4.forEach(el => {
                api.getOverviewDetails(el.slice(7, -1))
                    .then(data1 => {
                        sim.push(data1)
                        console.log(cnt1, data4.length)

                        if (cnt1 === data4.length) {
                            setSimilar(sim)
                            setFilm(obj)
                            setIsSending(false)
                        }
                        cnt1++
                    })
            })
        }

        effect().then(_ => {})


    }, [props.match.params.id])

    let similarAll = similar.map(el => <Similar {...el}/>)

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
                            <a className={style.watchBtn} href="#"
                               onClick={() => alert("К сожалению я не смог найти ссылку на трейлер из их апишки 😔")}>Watch</a>
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