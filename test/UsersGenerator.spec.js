'use strict';

var UsersGenerator = require('../generator/index').UsersGenerator;

var chai = require('chai');
var expect = chai.expect;

/* global describe, it, beforeEach, fail */
var log4js = require('log4js'), util = require('util');
var log = log4js.getLogger('UsersGenerator_test');

describe('UsersGenerator', function () {

	var usersGen;

	// run before every test in the suite
	beforeEach(function () {
		usersGen = new UsersGenerator();
	});

	it('should be able to generate some fake users objects', function () {

		var users = usersGen.generateUsers(5);

		users.forEach(function (user) {
			expect(user).to.have.keys(
				'userId', 'username', 'password', 'roles', 'contact', 'cdate', 'mdate'
			);
		});

		log.info('Users generated by faker', users);
	});
});
