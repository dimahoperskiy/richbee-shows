import React from "react";
import {NavLink} from "react-router-dom";
import style from "./Film.module.css"

const Film = (props) => {
    let imageUrl

    if (props.i) {
        imageUrl = props.i.imageUrl
    } else {
        imageUrl = "https://bytes.ua/wp-content/uploads/2017/08/no-image.png"
    }

    return (
        <div className={style.wrapper}>
            <NavLink to={`info/${props.id}`}>
                <img className={style.img} src={imageUrl} alt=""/>
            </NavLink>
            <div className={style.inner}>
                <div className={style.header}>
                    <NavLink className={style.linkTo} to={`/info/${props.id}`}>
                        <h3 className={style.title}>{props.l}</h3>
                    </NavLink>
                    <div className={style.rating}>
                        <p>IMDb {props.rating || "?"}</p>
                    </div>
                </div>
                <div className={style.info}>
                    <p>{props.q || "?"}</p>
                    <p>|</p>
                    <p>{props.genre || "?"}</p>
                    <p>|</p>
                    <p>{props.y || "?"}</p>
                </div>
                <hr/>
                <div className={style.globe}>
                    {props.otherRating ?
                        <>
                            <p>{props.otherRating.label} #{props.otherRating.rank}</p>
                            <p>|</p>
                            <p>Won {props.globes} Golden Globes.</p>
                        </>
                        :
                        ""
                    }
                </div>
                <div className={style.awards}>
                    <p>Another {props.wins} wins & {props.loses} nominations</p>

                </div>

            </div>
        </div>
    )
}

export default Film