const asyncHander = fn => {
  return (req, rest, next) => {
    fn(req, rest, next).catch(next)
  }
}

module.exports = {
  asyncHander
}