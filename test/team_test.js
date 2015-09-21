var expect = require('chai').expect
  , team = require("../lib/team");

describe('team', function () {

  it('finds all employees using #getAllEmployees', function () {
    var employees = team.getAllEmployees();
    expect(employees.length).to.eq(4);
  });

  it("finds a single employee using #getEmployeeById", function () {
    var employee = team.getEmployeeById("thb");
    expect(employee.firstname).to.equal("Thomas");
  });

  it("finds returns null if the id does not match an employee", function () {
    var employee = team.getEmployeeById("xyz");
    expect(employee).to.be.null;
  });
});
