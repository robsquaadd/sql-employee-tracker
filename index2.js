const inquirer = require("inquirer");
const mysql2 = require("mysql2/promise");
const cTable = require("console.table");

const initializeConnection = async () => {
  const db = await mysql2.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "UFwrstlr#125",
      database: "employees",
    },
    console.log("Connected to the employee database")
  );
  return db;
};

const mainMenu = async () => {
  const userChoice = await inquirer.prompt({
    type: "list",
    name: "actionChoice",
    message: "What would you like to do?: ",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "#View All Employees By Manager",
      "View All Employees By Department",
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
  return userChoice.actionChoice;
};

const generateDepartmentList = async (db) => {
  let departmentList = await db
    .query(`SELECT * FROM departments`)
    .then(([rows]) => {
      var array = [];
      for (i = 0; i < rows.length; i++) {
        array.push(rows[i].department_name);
      }
      return array;
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  return departmentList;
};

const generateRoleList = async (db) => {
  let roleList = await db
    .query(`SELECT * FROM roles`)
    .then(([rows]) => {
      var array = [];
      for (i = 0; i < rows.length; i++) {
        array.push(rows[i].role_title);
      }
      return array;
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  return roleList;
};

const generateEmployeeList = async (db) => {
  let employeeList = await db
    .query(`SELECT * FROM employees`)
    .then(([rows]) => {
      var array = [];
      for (i = 0; i < rows.length; i++) {
        array.push(`${rows[i].first_name} ${rows[i].last_name}`);
      }
      return array;
    });
  return employeeList;
};

const viewAll = (db, actionChoice) => {
  const sql = `SELECT * FROM ${actionChoice}`;
  let query = db
    .query(sql)
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  return query;
};

const viewByDepartment = async (db) => {
  const departmentList = await generateDepartmentList(db);
  const departmentChoice = await inquirer.prompt({
    type: "list",
    name: "departmentChoice",
    message: "Which department would you like to see the employees of?: ",
    choices: departmentList,
  });
  const sql = `SELECT employees.*, departments.department_name FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE departments.department_name = '${departmentChoice.departmentChoice}'`;
  let query = db
    .query(sql)
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
      console.log("\n");
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  return query;
};

const addADepartment = async (db) => {
  const departmentInfo = await inquirer.prompt({
    type: "input",
    name: "departmentName",
    message: "What is the name of this department?: ",
  });
  const sql = `INSERT INTO departments (department_name)
  VALUES (?)`;
  const params = [departmentInfo.departmentName];
  let query = db
    .query(sql, params)
    .then(([rows]) => {
      console.log("Data Added to the Departments Table");
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  return query;
};

const addARole = async (db) => {
  const departmentList = await generateDepartmentList(db);
  const roleInfo = await inquirer.prompt([
    {
      type: "input",
      name: "roleName",
      message: "What is the name of this role?: ",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary (in dollars) for this role?: ",
    },
    {
      type: "list",
      name: "roleDepartment",
      message: "What department does this role belong in?",
      choices: departmentList,
    },
  ]);
  const sql = `INSERT INTO roles (role_title, role_salary, department_id)
  VALUES (?,?,?)`;
  for (i = 0; i < departmentList.length; i++) {
    if (roleInfo.roleDepartment === departmentList[i]) {
      var departmentID = i + 1;
    }
  }
  const params = [roleInfo.roleName, roleInfo.roleSalary, departmentID];
  let query = db
    .query(sql, params)
    .then(([rows]) => {
      console.log("Role was added to the Roles database");
      console.log(rows);
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  return query;
};

const addAnEmployee = async (db) => {
  const roleList = await generateRoleList(db);
  const employeeList = await generateEmployeeList(db);
  const employeeInfo = await inquirer.prompt([
    {
      type: "input",
      name: "employeeFirstName",
      message: "What is the employee's first name?: ",
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "What is the employee's last name?: ",
    },
    {
      type: "list",
      name: "employeeRole",
      message: "What is the employee's role?: ",
      choices: roleList,
    },
    {
      type: "list",
      name: "employeeManager",
      message: "Who is the employee's manager?: ",
      choices: employeeList,
    },
  ]);
  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`;
  for (i = 0; i < roleList.length; i++) {
    if (employeeInfo.employeeRole === roleList[i]) {
      var roleID = i + 1;
    }
  }
  for (i = 0; i < employeeList.length; i++) {
    if (employeeInfo.employeeManager === employeeList[i]) {
      var managerID = i + 1;
    }
  }
  const params = [
    employeeInfo.employeeFirstName,
    employeeInfo.employeeLastName,
    roleID,
    managerID,
  ];
  let query = db
    .query(sql, params)
    .then(([rows]) => {
      console.log("\n" + "Employee was added to the employee database!" + "\n");
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  return query;
};

const quit = () => {
  console.log("Goodbye");
  process.exit();
};

const init = async () => {
  let db = await initializeConnection();
  let exit = false;
  while (exit === false) {
    let initialChoice = await mainMenu();
    if (initialChoice === "Quit") {
      exit = true;
      return quit();
    } else if (
      initialChoice === "View All Departments" ||
      initialChoice === "View All Roles" ||
      initialChoice === "View All Employees"
    ) {
      await viewAll(db, initialChoice.substring(9).toLowerCase());
    } else if (initialChoice === "View All Employees By Department") {
      await viewByDepartment(db);
    } else if (initialChoice === "Add a Department") {
      await addADepartment(db);
    } else if (initialChoice === "Add a Role") {
      await addARole(db);
    } else if (initialChoice === "Add an Employee") {
      await addAnEmployee(db);
    } else if (initialChoice === "Update an Employee Role") {
      await updateRole(db);
    }
  }
};

init();
