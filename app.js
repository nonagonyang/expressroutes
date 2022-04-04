const express=require('express');
const app=express();
const ExpressError=require("./error")

function makeNumArray(string){
    const stringarr=string.split(",")
    const numarr=stringarr.map(n => +n );
    return numarr
}


function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}

function mode(arr) {
    const count = {};
    arr.forEach(e => {
      if (!(e in count)) {
        count[e] = 0;
      }
      count[e]++;
    });
    let bestElement;
    let bestCount = 0;
    Object.entries(count).forEach(([k, v]) => {
      if (v > bestCount) {
        bestElement = k;
        bestCount = v;
      }
    });
    return bestElement;
  };



app.get("/mean", (req, res,next)=>{
    try{
        const {nums}=req.query
        if(!nums) throw new ExpressError("nums are required",400) 
        const numarr=makeNumArray(nums)
        if (numarr instanceof Error) {
            throw new ExpressError(numarr.message);
          }
        // if(!numarr[0]) throw new ExpressError(`these are not numbers`,400)
        const average = numarr.reduce((a,b) => a + b, 0) / numarr.length;
        return res.json({response: {
            operation: "mean",
            value: average
        }})
    } catch(e){
        next(e)
    }
    
})

app.get("/median",(req,res)=>{
    const {nums}=req.query
    const numarr=makeNumArray(nums)
    const result=median(numarr)
    return res.json({response: {
        operation: "median",
        value: result
      }})
})

app.get("/mode",(req,res)=>{
    const {nums}=req.query
    const numarr=makeNumArray(nums)
    const result=mode(numarr)
    return res.json({response: {
        operation: "mode",
        value: result
      }})

})

app.use(function (req, res, next) {
    const notFoundError = new ExpressError("nums are required", 404);
    return next(notFoundError)
  });

app.use(function(err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.msg;
  
    // set the status and alert the user
    return res.status(status).json({
      error: {message, status}
    });
  });

app.listen(3000, function(){
    console.log("server running on port 3000")
})