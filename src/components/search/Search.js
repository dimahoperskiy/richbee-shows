import React, {useState, useEffect} from "react";
import {withRouter, useHistory} from "react-router-dom"

import style from "./Search.module.css"
import api from "../../api/api";
import Film from "../film/Film";
import SwiperCore, {Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/swiper.min.css";
import 'swiper/components/pagination/pagination.min.css';

SwiperCore.use([Pagination]);


const Search = (props) => {
    const [isSending, setIsSending] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [filmsList, setFilmsList] = useState([])
    const [hasError, setHasError] = useState(false)
    const [notFound, setNotFound] = useState(false)


    let history = useHistory()

    useEffect(() => {
        if (props.match.params.name) {
            setInputValue(props.match.params.name)
            history.push("/")
        }
    }, [])


    let valueChanged = (e) => {
        setInputValue(e.target.value)
    }

    let click = async (e) => {
        if (e) e.preventDefault()

        if (!inputValue) {
            setHasError(true)
        } else {
            setHasError(false)
            setIsSending(true)


            let data1 = await api.getFilmsByName(inputValue)
            if (data1.d !== undefined) {
                setNotFound(false)
                let film = data1.d[0]
                if (film.id.slice(0, 2) === "tt") {
                    let data2 = await api.getOverviewDetails(film.id)
                    if (data2.ratings.otherRanks) {
                        let rating = data2.ratings.otherRanks[0]
                        film.otherRating = {
                            label: rating.label,
                            rank: rating.rank
                        }
                    }
                    data2.genres ?
                        film.genre = data2.genres[0] :
                        film.genre = "?"
                    film.rating = data2.ratings.rating
                    let data3 = await api.getRatings(film.id)

                    let [win, lose, globe] = [0, 0, 0]

                    let awards = data3.resource.awards
                    if (awards) {
                        awards.forEach(el => {
                            if (el.isWinner) {
                                if (el.awardName === "Golden Globe") globe++
                                else win++
                            } else lose++
                        })
                    }
                    [film.globes, film.wins, film.loses] = [globe, win, lose]
                    setFilmsList(data1.d)
                    setIsSending(false)
                } else {
                    let films = data1.d.filter(el => el.id.slice(0, 2) === "tt")
                    setFilmsList(films)
                    setIsSending(false)
                }
            } else {
                setNotFound(true)
                setIsSending(false)
            }
        }
    }

    let slideChanged = async (swiper) => {
        setIsSending(true)
        let film = filmsList[swiper.activeIndex]

        let data = await api.getOverviewDetails(film.id)

        let newFilms = [...filmsList]
        if (data.ratings.otherRanks) {
            let rating = data.ratings.otherRanks[0]
            newFilms[swiper.activeIndex].otherRating = {
                label: rating.label,
                rank: rating.rank
            }
        }
        data.genres ?
            newFilms[swiper.activeIndex].genre = data.genres[0] :
            newFilms[swiper.activeIndex].genre = "?"

        newFilms[swiper.activeIndex].rating = data.ratings.rating
        let data1 = await api.getRatings(film.id)

        let win = 0
        let lose = 0
        let globe = 0
        let awards = data1.resource.awards
        if (awards) {
            awards.forEach(el => {
                if (el.isWinner) {
                    if (el.awardName === "Golden Globe") globe++
                    else win++
                } else lose++
            })
        }
        [
            newFilms[swiper.activeIndex].globes,
            newFilms[swiper.activeIndex].wins,
            newFilms[swiper.activeIndex].loses
        ] = [globe, win, lose]

        setFilmsList(newFilms)
        setIsSending(false)
    }


    let films


    films = filmsList.map(el => {
        return (
            <SwiperSlide>
                <Film {...el}/>
            </SwiperSlide>
        )
    })

    return (

        <div className={`${style.wrapper} ${isSending ? style.progress : ""}`}>
            <h1 className={`${style.title} ${style.first}`}>Unlimited movies,</h1>
            <h1 className={style.title}>TV shows, and more.</h1>
            <h2 className={style.info}>Watch anywhere. Cancel anytime.</h2>
            <div className={style.inputWrapper}>
                <input placeholder="Type here smth..." className={`${style.input} ${isSending ? style.progress : ""}`}
                       type="text" onChange={valueChanged} value={inputValue}/>
                <button className={`${style.btn} ${isSending ? style.progress : ""}`} onClick={click}>Search</button>
            </div>
            {hasError ? <p className={style.error}>You cannot send an empty string</p> : ""}
            {notFound ? <p className={style.error}>Nothing found</p> : ""}
            <div className={style.swiper}>
                <Swiper
                    pagination={{clickable: true}}
                    spaceBetween={10}
                    slidesPerView={1}
                    onSlideChange={slideChanged}>
                    {films}
                </Swiper>
            </div>
            <iframe className={style.video} width="100%" height="100%"
                    src="https://www.youtube.com/embed/gA0nQyDZR4A?start=20&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1&disablekb=1"
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen/>
        </div>
    )
}

export default withRouter(Search)