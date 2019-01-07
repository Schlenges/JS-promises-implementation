class Promise{

  constructor(fn){
    this.fn = fn
    this.state = PENDING
    this.value = null
    this.handlers = []
  }

  // this._doResolve(this.fn, this._resolve, this._reject)

  _resolve(result){ // accepts promise or plain value
    try{
      // check if result is a promise by checking for a returned .then() function
      let then = this._getThen(result)
      
      if(then){
        this._doResolve(then.bind(result), this._resolve, this._reject)
        return
      }

      this._fulfill(result)
    } catch(err){
      this._reject(err)
    }
  }

  _fulfill(result){
    this.state = FULFILLED
    this.value = result
  }

  _reject(error){
    this.state = REJECTED
    this.value = error
  }

  _getThen(result){ // check for function needed if it's an actual promise?
    let t = typeof result
    if(result && (t === 'object' || t === 'function')){
      let then = result.then
      if(typeof then === 'function'){
        return then
      }
    }
    return null
  }

  _doResolve(func, onResolved, onRejected){
    let done = false
    try{
      func(function(value){
        if(done) return
        done = true
        onResolved(value)
      }, function(err){
        if(done) return
        done = true
        onRejected(err)
      })
    } catch(exception){
      if(done) return
      done = true
      onRejected(exception)
    }
  }

}