var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

module.exports = function(app) {
  app.get('/',function(req, res) {
    res.render('index', {
		title: '主页',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	 });
  });

  app.get('/reg', checkNotLogin);
  app.get('/reg', function (req, res) {
    res.render('reg', {
		title: '注册',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	 });
  });

  app.post('/reg', checkNotLogin);
  app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//检验用户两次输入的密码是否一致
		if (password_re != password) {
			req.flash('error', '两次输入的密码不一致!');
			return res.redirect('/reg');//返回注册页
		}
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		//检查用户名是否已经存在
		User.get(newUser.name, function (err, user) {
			if (err) {
			req.flash('error', err);
			return res.redirect('/');
			}
			if (user) {
			req.flash('error', '用户已存在!');
			return res.redirect('/reg');//返回注册页
			}
			//如果不存在则新增用户
			newUser.save(function (err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');//注册失败返回主册页
			}
			req.session.user = user;//用户信息存入 session
			req.flash('success', 'Registered successfully!');
			res.redirect('/');//注册成功后返回主页
			});
		});
	});

  app.get('/login', checkNotLogin);
  app.get('/login', function (req, res) {
      res.render('login', {
          title: '登录',
          user: req.session.user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()});
  });

  app.post('/login',checkNotLogin);
  app.post('/login', function (req, res) {
       //生成密码的 md5 值
       var md5 = crypto.createHash('md5'),
           password = md5.update(req.body.password).digest('hex');
       //检查用户是否存在
       User.get(req.body.name, function (err, user) {
         if (!user) {
           req.flash('error', 'User is not existed!');
           return res.redirect('/login');//用户不存在则跳转到登录页
         }
         //检查密码是否一致
         if (user.password != password) {
           req.flash('error', 'Password not passed!');
           return res.redirect('/login');//密码错误则跳转到登录页
         }
         //用户名密码都匹配后，将用户信息存入 session
         req.session.user = user;
         req.flash('success', 'Login successfully!');
         res.redirect('/');//登陆成功后跳转到主页
       });
  });

  app.get('/post', checkLogin);
  app.get('/post', function (req, res) {
      req.session.user = null;
      req.flash('success','Logout successfully');
      res.redirect('/');
  });

  app.post('/post', checkLogin);
  app.post('/post', function (req, res) {
  });

  app.get('/logout', checkLogin);
  app.get('/logout', function (req, res) {
  });

  function checkNotLogin(req, res, next) {
      if (req.session.user) {
          req.flash('success','Already login!');
          res.redirect('/');
      }
      next();
  }

  function checkLogin(req, res, next) {
      if (!req.session.user) {
          req.flash('error', 'Not login!');
          res.redirect('back');
      }
      next();
  }
};
