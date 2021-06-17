import React, {useRef} from "react"
import style from "./Similar.module.css"
import {NavLink} from "react-router-dom";

const Similar = (props) => {
    let wrap = useRef()
    let toggle = useRef()

    let enter = (e) => {
        if (wrap.current) {
            wrap.current.classList.add(style.open)
            toggle.current.classList.add(style.active)
        }
    }

    let leave = (e) => {
        if (wrap.current) {
            wrap.current.classList.remove(style.open)
            toggle.current.classList.remove(style.active)

        }
    }

    return (
        <NavLink to={`/info/${props.id.slice(7, -1)}`}>
            <div className={style.wrapper} onMouseEnter={enter} onMouseLeave={leave}>
                <img src={props.title.image.url} alt="" ref={wrap}/>
                <div className={style.toggle} ref={toggle}>
                    <h2>{props.title.title}</h2>
                    <p>{props.genres[0]}</p>
                    <p>{props.title.titleType} {props.title.year}</p>
                    <div className={style.rating}>
                        <p>IMDb {props.ratings.rating || "?"}</p>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default Similar