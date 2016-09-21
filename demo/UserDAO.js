"use strict";

var loki = require('lokijs');
var _ = require('lodash');
var Promise  = require('bluebird');

//  variable to hold the singleton instance, if used in that manner
var userDAOInstance = undefined;

var log4js = require('log4js'),
 	log = log4js.getLogger('UserService');

//
// User Data Access Object
//

// Constructor
function UserDAO(dbName) {
	// Database filename
	var name = (typeof dbName !== 'undefined') ? dbName : this.dbName;

	var _self = this;

	// Loki instance
	this._db = new loki(name);
	this._users;

	// // Add users collection
	this._users = this._db.addCollection('users');

	this._db.loadDatabase({}, function(err, data) {
		_self._users = _self._db.getCollection('users');

		if(_self._users === null){
			_self._users = _self._db.addCollection('users');
		}
	});
}

// Default name of the database
UserDAO.prototype.dbName = 'janux-people.db';

// Returns the number of entities available.
UserDAO.prototype.count = function (callback) {

	var number = this._users.count();
	return new Promise(function(resolve){
		resolve( number );
	}).asCallback(callback);
};

// Find User Object by id
UserDAO.prototype.findById = function (userId, callback) {

	var users = this._users.findOne( { userId:userId });
	return new Promise(function(resolve){
		resolve( users );
	}).asCallback(callback);
};

// Find User Object by username
UserDAO.prototype.findByUsername = function (username, callback) {

	var users = this._users.findOne( { username:username } );
	return new Promise(function(resolve){
		resolve( users );
	}).asCallback(callback);
};

// Find users by matching a string
UserDAO.prototype.findByUsernameMatch = function (username, callback) {

	var users = this._users.find( { username: { '$contains': username } } );
	return new Promise(function(resolve){
		resolve( users );
	}).asCallback(callback);
};

// Find Users by name
UserDAO.prototype.findByName = function (name, callback) {
	var users = [];
	if(name !== ''){
		users = this._users.find({
			'$or': [
				{ 'contact.name.first' : {'$contains': name} },
				{ 'contact.name.middle' : {'$contains': name} },
				{ 'contact.name.last' : {'$contains': name} }
			]});
	}else{
		users = this._users.find();
	}

	return new Promise(function(resolve){
		resolve( users );
	}).asCallback(callback);
};

// Find User Object by email address
UserDAO.prototype.findByEmail = function (email, callback) {
	var userByEmail = [];
	if(email !== ''){
		userByEmail = this._users.findOne(
			{ 'contact.contactMethods.emails.address': email }
		);
	}else{
		userByEmail = this._users.find();
	}

	return new Promise(function(resolve){
		resolve( userByEmail );
	}).asCallback(callback);
};

// Find Users by phone number
UserDAO.prototype.findByPhone = function (number, callback) {
	var userByPhone = [];
	if(number !== '') {
		userByPhone = this._users.find(
			{ 'contact.contactMethods.phoneNumbers.number': number }
		);
	}else{
		userByPhone = this._users.find();
	}

	return new Promise(function(resolve){
		resolve( userByPhone );
	}).asCallback(callback);
};

// Save new Users Objects
UserDAO.prototype.save = function (aUserObj) {
	this._users.insert(aUserObj);
	this._db.saveDatabase();
};

// Save or update users Object
UserDAO.prototype.saveOrUpdate = function (aUserObj) {
	var userExists = this._users.findOne( { 'userId': aUserObj.userId } );

	if(userExists !== null) {
		this._users.update( aUserObj );
	}else{
		this._users.insert( aUserObj );
	}
	this._db.saveDatabase();
};

// Delete User Object
UserDAO.prototype.delete = function (doc) {
	this._users.remove( doc );
	this._db.saveDatabase();
};

// Returns a new instance
exports.createInstance = function(dbPath) {
	return new UserDAO(dbPath);
};

// Returns the current stored instance (if it exists) or creates a new instance and stores
exports.singleton = function(dbPath) {
	// if the singleton has not yet been instantiated, do so
	if ( !_.isObject(userDAOInstance) ) {
		userDAOInstance = new UserDAO(dbPath);
	}

	return userDAOInstance;
};

// Returns the object that has not yet been instantiated
exports.object = function(dbName) {
	// Sets the name and location of the file of the database
	UserDAO.prototype.dbName = (typeof dbName !== 'undefined') ? dbName : UserDAO.prototype.dbName;
	return UserDAO;
};