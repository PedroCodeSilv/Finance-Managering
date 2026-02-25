CREATE TABLE users(
	id serial primary key,
	name varchar(255) not null,
	email varchar(255)not null unique,
	passwordHash varchar(255)not null,
	createAt timestamp not null default now(),
);


