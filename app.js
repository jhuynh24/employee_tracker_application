const inquirer = require("inquirer");
const mysql = require("mysql");
require ("console.table");
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Fghfgh77",
    database: "employeedb"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainMenu();
  });

function mainMenu() {
    inquirer.prompt({
        type: "list",
        name: "menu",
        message: "What action would you like to take?",
        choices: ["add", "view", "update"]
    }).then(answers => {
        if (answers.menu === "add") {
            add();
        }
        else if (answers.menu === "view") {
            view();
        }
        else {
            update();
        }
    })
}

function add() {
    inquirer.prompt({
        type: "list",
        name: "menu",
        message: "What would you like to add?",
        choices: ["department", "role", "employee"]
    }).then(answers => {
        if (answers.menu === "department") {
            addDepartment();
        }
        else if (answers.menu === "role") {
            addRole();
        }
        else {
            addEmployee();
        }
    })
}

function view() {
    inquirer.prompt({
        type: "list",
        name: "menu",
        message: "What would you like to view?",
        choices: ["department", "role", "employee"]
    }).then(answers => {
        if (answers.menu === "department") {
            viewDepartment();
        }
        else if (answers.menu === "role") {
            viewRole();
        }
        else {
            viewEmployee();
        }
    })
}

function update() {
    inquirer.prompt({
        type: "list",
        name: "menu",
        message: "What would you like to update?",
        choices: ["employee_role"]
    }).then(answers => {
        updateEmployeeRole();
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the department name?"
        }
    ]).then(answers => {
        console.log(answers.departmentName);
        connection.query(
            "INSERT INTO department SET ?",
            {
              name: answers.departmentName,
            },
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " department inserted!\n");
              // Call updateProduct AFTER the INSERT completes
              mainMenu();
            }
          );
        
    })
}

function addRole() {
    let departments = [];
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        departments.push({
            value: res[i].id, name: res[i].name
        });
    }
})
    inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary for the given role?"
        },
        {
            type: "list",
            name: "departmentId",
            message: "What department does this role belong to?",
            choices: departments,
        }
    ]).then(answers => {
        console.log(answers);
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: answers.roleName,
              salary: answers.roleSalary,
              department_id: answers.departmentId
            },
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " role inserted!\n");
              // Call updateProduct AFTER the INSERT completes
              mainMenu();
            }
          );
        
    })
}

function addEmployee() {
    let roles = [];
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        roles.push({
            value: res[i].id, name: res[i].title
        });
    }
})
let employees = [{
    value: null, name: "None"
}];
connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
for (var i = 0; i < res.length; i++) {
    employees.push({
        value: res[i].id, name: res[i].first_name + res[i].last_name
    });
}
})
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roles
        },
        {
            type: "list",
            name: "managerId",
            message: "What is the employee's manager?",
            choices: employees
        }
    ]).then(answers => {
            connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
                manager_id: answers.managerId
            },
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " employee inserted!\n");
              // Call updateProduct AFTER the INSERT completes
              mainMenu();
            }
          );
        
    })
}

function viewDepartment() {
    console.log("Selecting department...\n");
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      mainMenu();
    });
}

function viewRole() {
    console.log("Selecting role...\n");
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      mainMenu();
    });
}

function viewEmployee() {
    console.log("Selecting employee...\n");
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      mainMenu();
    });
}

       
function updateEmployeeRole() {
    //let employees = getEmployees();
    let employees = [{
        value: 1, name: "1"
    },{value:2, name: "2"}];
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        employees.push({
            value: res[i].id, name: res[i].first_name + res[i].last_name
        });
    }
    console.log(employees);
})
console.log(employees);
    let roles = [];
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        roles.push({
            value: res[i].id, name: res[i].title
        });
    }
})
inquirer.prompt([
    {
        type: "list",
        name: "employeeId",
        message: "What employee do you want to update?",
        choices: employees
    },
    {
        type: "list",
        name: "roleId",
        message: "What would you like the employee's role to be?",
        choices: roles
    }
]).then(answers => {
        connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{role_id: answers.roleId}, {id: answers.employeeId}], 
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee inserted!\n");
          // Call updateProduct AFTER the INSERT completes
          mainMenu();
        }
      );
    
})
}

// function getEmployees() {
//     var employees = [];
//     connection.query("SELECT * FROM employee", function(err, res) {
//         if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//         employees.push({
//             value: res[i].id, name: res[i].first_name + res[i].last_name
//         });
//     }
// })
// return employees;
// }