module.exports = function(app, opts) {
  // TODO parse opts

  var url = opts.url;
  var template = opts.template;

  app.get(url, function(req, res) {
    res.render(template, {title: 'Home - migreva.com'})
  });

  console.log('setting up route %s at %s', template, url);
  
  return {

  }
}