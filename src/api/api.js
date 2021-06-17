import axios from "axios"

const inst = axios.create({
    baseURL: "https://imdb8.p.rapidapi.com/",
    headers: {
        'x-rapidapi-key': '3bd9821c43msh3d8d144ef02f038p14c79ejsne9fdc4de02a6',
        'x-rapidapi-host': 'imdb8.p.rapidapi.com'
    },
    method: 'GET'
})

const api = {
    getFilmsByName (name) {
        return inst.request({
            url: "title/auto-complete",
            params: {q: name}
        })
            .then(res => res.data)
            .catch(err => console.error(err))
    },
    getOverviewDetails (id) {
        return inst.request({
            url: "title/get-overview-details",
            params: {tconst: id}
        })
            .then(res => res.data)
            .catch(err => console.error(err))
    },
    getRatings (id) {
        return inst.request({
            url: "title/get-awards",
            params: {tconst: id}
        })
            .then(res => res.data)
            .catch(err => console.error(err))
    },
    getVideos (id) {
        return inst.request({
            url: "title/get-videos",
            params: {tconst: id}
        })
            .then(res => res.data)
            .catch(err => console.error(err))
    },
    getImages (id) {
        return inst.request({
            url: "title/get-images",
            params: {tconst: id}
        })
            .then(res => res.data)
            .catch(err => console.error(err))
    },
    getPlots (id) {
        return inst.request({
            url: "title/get-plots",
            params: {tconst: id}
        })
            .then(res => res.data)
            .catch(err => console.error(err))
    },
    getSimilar (id) {
        return inst.request({
            url: "title/get-more-like-this",
            params: {tconst: id}
        })
            .then(res => {
                let ans
                if (res.data.length > 4) {
                    ans = res.data.slice(0, 4)
                } else ans = res.data
                return ans
            })
            .catch(err => console.error(err))
    }
}

export default api