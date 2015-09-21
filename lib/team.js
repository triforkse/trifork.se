var YAML = require('yamljs');
var path = require('path');
var glob = require("glob")
var _ = require('lodash');

var employees = null;

var getAllEmployees = function(callback) {
  if (employees) return employees;

  var dataDir = path.normalize(__dirname + '/../team/data');

  var files = glob.sync(dataDir + '/*.yml')
  employees = [];

  files.forEach(function(f) {
    var content = YAML.load(f);
    employees.push(content);
  });

  return employees;
};

var getEmployeeById = function(id) {
  // TODO: Liniar Search, works as long as we are just looking at a few records.
  if (!employees) {
    getAllEmployees();
  }

  return _.find(employees, function(e) { return e.id === id; }) || null;
};

module.exports = {
  getEmployeeById: getEmployeeById,
  getAllEmployees: getAllEmployees
}
