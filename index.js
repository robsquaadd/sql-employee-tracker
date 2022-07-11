const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const cTable = require("console.table");
const db = mysql2.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "UFwrstlr#125",
    database: "employees",
  },
  console.log("Connected to the employee database")
);

const userChoice = async () => {
  const mainMenu = await inquirer.prompt({
    type: "list",
    message: "What would you like to do?: \n",
    name: "chooseAction",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "#View All Employees By Manager",
      "#View All Employees By Department",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "#Delete a Department",
      "#Delete a Role",
      "#Delete an Employee",
      "#Update an Employee Role",
      "#Update an Employees Manager",
      "#View Department Budget",
      "Quit",
    ],
  });
  return mainMenu.chooseAction;
};

const viewAll = (userSelection) => {
  if (userSelection === "View All Departments") {
    var sql = "SELECT * FROM department";
  } else if (userSelection === "View All Roles") {
    var sql = "SELECT * FROM roles";
  } else {
    var sql = "SELECT * FROM employee";
  }
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log("\n");
      console.table(rows);
      console.log("\n" + "Click any key to continue!");
    }
  });
};

const groupEmployees = () => {
  const sql = `SELECT * FROM employees `;
};

const addADepartment = async () => {
  const departmentInfo = await inquirer.prompt({
    type: "input",
    name: "departmentName",
    message: "What is the name of this department?",
  });
  const sql = `INSERT INTO department (department_name)
  VALUES (?)`;
  const params = [departmentInfo.departmentName];
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`${departmentInfo.departmentName} was added to Departments`);
    }
  });
};

const addARole = async () => {
  const roleInfo = await inquirer.prompt([
    {
      type: "input",
      name: "roleName",
      message: "What is the name of this role?: ",
    },
    {
      type: "number",
      name: "roleSalary",
      message: "What is the salary (in dollars) for this role?: ",
    },
    {
      type: "number",
      name: "departmentID",
      // area for refinement
      message: "What is the ID for the department this role is listed under?: ",
    },
  ]);
  const sql = `INSERT INTO roles (role_title, role_salary, department_id)
  VALUES (?,?,?)`;
  const params = [
    roleInfo.roleName,
    roleInfo.roleSalary,
    roleInfo.departmentID,
  ];
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
};

const addAnEmployee = async () => {
  const employeeInfo = await inquirer.prompt([
    {
      type: "input",
      name: "employeeFirstName",
      message: "What is their first name?: ",
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "What is their last name?: ",
    },
    {
      type: "number",
      name: "roleID",
      message: "What is the ID of the role of this employee?: ",
    },
    {
      type: "number",
      name: "managerID",
      message: "What is the employee ID of the manager of this employee?: ",
    },
  ]);
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES(?,?,?,?)`;
  const params = [
    employeeInfo.employeeFirstName,
    employeeInfo.employeeLastName,
    employeeInfo.roleID,
    employeeInfo.managerID,
  ];
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
};

const updateEmployeeRole = async () => {
  const employeeToBeUpdated = await inquirer.prompt([
    {
      type: "number",
      name: "employeeID",
      message:
        "What is the ID of the employee whose role you would like to update?: ",
    },
    {
      type: "number",
      name: "newRoleID",
      message: "What is the ID of the employee's updated role?: ",
    },
  ]);
  const sql = `UPDATE employee SET role_id=? WHERE id=?`;
  const params = [
    employeeToBeUpdated.newRoleID,
    employeeToBeUpdated.employeeID,
  ];
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
};

const generateDepartmentBudget = async () => {
  const answersArray = await createDepartmentList();
  const departmentSelection = await inquirer.prompt({
    type: "list",
    name: "departmentChoice",
    message: "Which department would you like to get the budget for?",
    choices: answersArray,
  });
  console.log(departmentSelection.departmentChoice);
};

const createDepartmentList = () => {
  const sql = `SELECT department_name FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
    }
  }).promise();
  return [0];
};

const init = async () => {
  let exit = false;
  while (exit === false) {
    let initialChoice = await userChoice();
    if (initialChoice === "Quit") {
      exit = true;
      return quit();
    } else if (
      initialChoice === "View All Departments" ||
      initialChoice === "View All Roles" ||
      initialChoice === "View All Employees"
    ) {
      viewAll(initialChoice);
    } else if (initialChoice === "Add a Department") {
      let departmentAdded = await addADepartment();
    } else if (initialChoice === "Add a Role") {
      let roleAdded = await addARole();
    } else if (initialChoice === "Add an Employee") {
      let employeeAdded = await addAnEmployee();
    } else if (initialChoice === "Update an Employee Role") {
      let employeeUpdated = await updateEmployeeRole();
    } else if (initialChoice === "#View Department Budget") {
      let departmentBudget = await generateDepartmentBudget();
    }
  }
};

const quit = () => {
  console.log("Goodbye");
  process.exit();
};

init();
