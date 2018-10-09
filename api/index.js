const request = require("../utils/request");

exports.getTrending = (time="monthly", lang="All Language") => request.get(`/trending`,{
    params : {
        time, lang
    }
});