if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI:'mongodb://vidjot:vidjot@ds147459.mlab.com:47459/vidjot-prod'
  }
}else{
  module.exports = {
    mongoURI:'mongodb://127.0.0.1:27017/vidjot-dev'
  }
}