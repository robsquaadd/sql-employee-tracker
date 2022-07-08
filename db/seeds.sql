INSERT INTO department (department_name)
VALUES ('Human Resources'),
('Finance'),
('Engineering'),
('Logistics'),
('Coding');

INSERT INTO roles (role_title, role_salary, department_id)
VALUES ('Assistant', 70000, 1),
('Technical Supervisor', 80000, 3),
('Budget Specialist', 55000, 2),
('Receptionist', 35000, 1),
('HR Manager', 120000, 1),
('Software Developer', 90000, 5),
('Shipping Supervisor', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Robert','Collier', 6, NULL),
('James', 'OBrien', 7, 1);
