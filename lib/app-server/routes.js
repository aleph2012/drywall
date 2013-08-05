function ensureAuthenticated(req, res, next)
{
  if (req.isAuthenticated())
    return next();

  res.set('X-Auth-Required', 'true');
  res.redirect('/login/?returnUrl='+ encodeURIComponent(req.originalUrl));
}

function ensureAdmin(req, res, next)
{
  if (req.user.canPlayRoleOf('admin'))
    return next();

  res.redirect('/');
}

function ensureAccount(req, res, next)
{
  if (req.user.canPlayRoleOf('account'))
    return next();

  res.redirect('/');
}

exports = module.exports = function(app, passport)
{
  //front end
  app.get('/', require('views/index').init);

  //sign up
  app.get('/signup/', require('views/signup/index').init);
  app.post('/signup/', require('views/signup/index').signup);

  //social sign up
  app.post('/signup/social/', require('views/signup/index').signupSocial);

  app.get('/signup/twitter/', passport.authenticate('twitter', { callbackURL: '/signup/twitter/callback/' }));
  app.get('/signup/twitter/callback/', require('views/signup/index').signupTwitter);

  app.get('/signup/github/', passport.authenticate('github', { callbackURL: '/signup/github/callback/' }));
  app.get('/signup/github/callback/', require('views/signup/index').signupGitHub);

  app.get('/signup/facebook/', passport.authenticate('facebook', { callbackURL: '/signup/facebook/callback/' }));
  app.get('/signup/facebook/callback/', require('views/signup/index').signupFacebook);

  //login/out
  app.get('/login/', require('views/login/index').init);
  app.post('/login/', require('views/login/index').login);
  app.get('/login/forgot/', require('views/login/forgot/index').init);
  app.post('/login/forgot/', require('views/login/forgot/index').send);
  app.get('/login/reset/', require('views/login/reset/index').init);
  app.get('/login/reset/:token/', require('views/login/reset/index').init);
  app.put('/login/reset/:token/', require('views/login/reset/index').set);
  app.get('/logout/', require('views/logout/index').init);

  //social login

  app.get('/auth/singly/:service', passport.authenticate('singly', { callbackURL: '/auth/singly/callback/' }));
  app.get('/auth/singly/callback/', require('views/login/index').loginSingly);

  app.get('/login/twitter/', passport.authenticate('twitter', { callbackURL: '/login/twitter/callback/' }));
  app.get('/login/twitter/callback/', require('views/login/index').loginTwitter);

  app.get('/login/github/', passport.authenticate('github', { callbackURL: '/login/github/callback/' }));
  app.get('/login/github/callback/', require('views/login/index').loginGitHub);
  app.get('/login/facebook/', passport.authenticate('facebook', { callbackURL: '/login/facebook/callback/' }));
  app.get('/login/facebook/callback/', require('views/login/index').loginFacebook);

  //admin
  app.all('/admin*', ensureAuthenticated);
  app.all('/admin*', ensureAdmin);
  app.get('/admin/', require('views/admin/index').init);

  //admin > users
  app.get('/admin/users/', require('views/admin/users/index').find);
  app.post('/admin/users/', require('views/admin/users/index').create);
  app.get('/admin/users/:id/', require('views/admin/users/index').read);
  app.put('/admin/users/:id/', require('views/admin/users/index').update);
  app.put('/admin/users/:id/password/', require('views/admin/users/index').password);
  app.put('/admin/users/:id/role-admin/', require('views/admin/users/index').linkAdmin);
  app.delete('/admin/users/:id/role-admin/', require('views/admin/users/index').unlinkAdmin);
  app.put('/admin/users/:id/role-account/', require('views/admin/users/index').linkAccount);
  app.delete('/admin/users/:id/role-account/', require('views/admin/users/index').unlinkAccount);
  app.delete('/admin/users/:id/', require('views/admin/users/index').deleteUser);

  //admin > administrators
  app.get('/admin/administrators/', require('views/admin/administrators/index').find);
  app.post('/admin/administrators/', require('views/admin/administrators/index').create);
  app.get('/admin/administrators/:id/', require('views/admin/administrators/index').read);
  app.put('/admin/administrators/:id/', require('views/admin/administrators/index').update);
  app.put('/admin/administrators/:id/permissions/', require('views/admin/administrators/index').permissions);
  app.put('/admin/administrators/:id/groups/', require('views/admin/administrators/index').groups);
  app.put('/admin/administrators/:id/user/', require('views/admin/administrators/index').linkUser);
  app.delete('/admin/administrators/:id/user/', require('views/admin/administrators/index').unlinkUser);
  app.delete('/admin/administrators/:id/', require('views/admin/administrators/index').deleteAdmin);

  //admin > admin groups
  app.get('/admin/admin-groups/', require('views/admin/admin-groups/index').find);
  app.post('/admin/admin-groups/', require('views/admin/admin-groups/index').create);
  app.get('/admin/admin-groups/:id/', require('views/admin/admin-groups/index').read);
  app.put('/admin/admin-groups/:id/', require('views/admin/admin-groups/index').update);
  app.put('/admin/admin-groups/:id/permissions/', require('views/admin/admin-groups/index').permissions);
  app.delete('/admin/admin-groups/:id/', require('views/admin/admin-groups/index').deleteGroup);

  //admin > accounts
  app.get('/admin/accounts/', require('views/admin/accounts/index').find);
  app.post('/admin/accounts/', require('views/admin/accounts/index').create);
  app.get('/admin/accounts/:id/', require('views/admin/accounts/index').read);
  app.put('/admin/accounts/:id/', require('views/admin/accounts/index').update);
  app.put('/admin/accounts/:id/user/', require('views/admin/accounts/index').linkUser);
  app.delete('/admin/accounts/:id/user/', require('views/admin/accounts/index').unlinkUser);
  app.delete('/admin/accounts/:id/', require('views/admin/accounts/index').deleteAccount);

  //admin > search
  app.get('/admin/search/', require('views/admin/search/index').find);

  //account
  app.all('/account*', ensureAuthenticated);
  app.all('/account*', ensureAccount);
  app.get('/account/', require('views/account/index').init);

  //account > settings
  app.get('/account/settings/', require('views/account/settings/index').init);
  app.put('/account/settings/', require('views/account/settings/index').update);
  app.put('/account/settings/identity/', require('views/account/settings/index').identity);
  app.put('/account/settings/password/', require('views/account/settings/index').password);

  //account > settings > social
  app.get('/account/settings/twitter/', passport.authenticate('twitter', { callbackURL: '/account/settings/twitter/callback/' }));
  app.get('/account/settings/twitter/callback/', require('views/account/settings/index').connectTwitter);
  app.get('/account/settings/twitter/disconnect/', require('views/account/settings/index').disconnectTwitter);
  app.get('/account/settings/github/', passport.authenticate('github', { callbackURL: '/account/settings/github/callback/' }));
  app.get('/account/settings/github/callback/', require('views/account/settings/index').connectGitHub);
  app.get('/account/settings/github/disconnect/', require('views/account/settings/index').disconnectGitHub);
  app.get('/account/settings/facebook/', passport.authenticate('facebook', { callbackURL: '/account/settings/facebook/callback/' }));
  app.get('/account/settings/facebook/callback/', require('views/account/settings/index').connectFacebook);
  app.get('/account/settings/facebook/disconnect/', require('views/account/settings/index').disconnectFacebook);

  //route not found
  app.all('*', require('views/http/index').http404);
}