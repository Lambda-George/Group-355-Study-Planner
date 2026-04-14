const getLoginPage = (req, res) => {
  const blogs = [
    {
      header: 'Test header 1',
      snippet: 'Test body 1, Test body 1, Test body 1',
    },
    {
      header: 'Test header 2',
      snippet: 'Test body 2, Test body 2, Test body 2',
    },
    {
      header: 'Test header 3',
      snippet: 'Test body 3, Test body 3, Test body 3',
    },
  ]
  res.render('login', { blogs })
}

module.exports = {
  getLoginPage,
}
