Vue.filter('filesize', value => {
    let units = ['B', 'KB', 'MB', 'GB', 'TB']
    let format = (v, p) => (v / Math.pow(1024, p)).toFixed(2) + units[p]

    value = parseFloat(value, 10)
    for (var i = 0; i < units.length; i++) {
        if (value < Math.pow(1024, i)) return units[i - 1] ? format(value, i - 1) : value + units[i]
    }
    return format(value, i - 1)
})

Vue.filter('moment1', value => moment(value).format('MMM Do YY, h:mma'))

Vue.filter('duration', value => {
    let tempTime = moment.duration(value)
    return tempTime.hours().pad(2) + ':' + tempTime.minutes().pad(2) + ':' + tempTime.seconds().pad(2)
})

Vue.filter('duration-human', value => {
    let tempTime = moment.duration(value)
    let hours = tempTime.hours()
    let minutes = tempTime.minutes()
    let seconds = tempTime.seconds()
    if (hours > 0) return hours + ' hour' + (hours > 1 ? 's ' : ' ') + minutes + ' minute' + (minutes > 1 ? 's ' : ' ')
    else if (minutes > 0) return minutes + ' minute' + (minutes > 1 ? 's ' : ' ') + seconds + ' second' + (seconds > 1 ? 's ' : ' ')
    else return seconds + ' second' + (seconds > 1 ? 's ' : ' ')
})
