const express = require('express');
const ExpressError = require('./ExpressError')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.status(200)
    return response.send('Dogs go brk brk');
});

app.get('/mean', function(request, response, next) {
    try {
        const nums = request.query.nums
        const arr = nums.split(',')
        const parseArr = arr.map((string) => parseInt(string))
        const errNums = parseArr.filter(num => isNaN(num))
        if (errNums.length > 0) {
            throw new ExpressError('send only numbers', 400)
        }
        const mean = (parseArr.reduce((prev, curr) => prev + curr, 0) / parseArr.length)
        response.status(200)
        return response.json({ 'operation': 'mean', 'mean': mean });
    } catch (err) {
        return next(err)
    }
});

app.get('/median', function(request, response, next) {
    const nums = request.query.nums
    const arr = nums.split(',')
    const parseArr = arr.map((string) => parseInt(string))
    const errNums = parseArr.filter(num => isNaN(num))
    const mid = Math.floor(parseArr.length / 2)
    const sorted = parseArr.sort((a, b) => a - b)
    let med
    if (mid % 2 === 0) {
        med = sorted[mid]
    } else {
        med = (sorted[mid - 1] + sorted[mid]) / 2
    }
    return response.json({ 'operation': 'median', 'median': med });

});


app.get('/mode', function(request, response, next) {
    const nums = request.query.nums
    const arr = nums.split(',')
    let mode
    for (let i in arr) {
        let count = 0
        let highscore = [0, 0]
        for (let j in arr) {
            if (arr[i] == arr[j]) {
                count++
            }
            if (count > 1 && count > highscore[1]) {
                highscore[0] = arr[i]
                highscore[1] = count
            }
        }
        mode = highscore[0]
    }
    return response.json({ 'operation': 'mode', 'mode': mode })
})

app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    return res.json({
        error: err,
    });
});



app.use(function(req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});

app.listen(3000, function() {
    console.log('App on port 3000');
})