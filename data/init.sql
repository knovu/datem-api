/* Reset DB by dropping tables */
DROP TABLE IF EXISTS RefreshTokens;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Organizations;

/* Creates tables in SQLite */
CREATE TABLE Organizations (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(256) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Email VARCHAR(256) NOT NULL UNIQUE,
    Password VARCHAR(60) NOT NULL,
    FirstName VARCHAR(256) NOT NULL,
    LastName VARCHAR(256) NOT NULL,
    Phone VARCHAR(256),
    OrganizationID INTEGER NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    FOREIGN KEY (OrganizationID) REFERENCES Organizations(ID) ON DELETE CASCADE
);

CREATE TABLE RefreshTokens (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    Token VARCHAR(255) NOT NULL UNIQUE,
    Revoked BOOLEAN NOT NULL DEFAULT FALSE,        
    IPAddress VARCHAR(45),
    UserAgent TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Enforce uniqueness for UserID and Token
    CONSTRAINT unique_user_token UNIQUE (UserID, Token),

    -- Foreign keys
    FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
);

/* Seeds default data in SQLite */
INSERT INTO Organizations (Name)
VALUES ('A Test Org');
INSERT INTO Users (OrganizationID, Email, Password, FirstName, LastName, Phone) 
VALUES ((SELECT ID FROM Organizations WHERE Name = 'A Test Org'), 'a+test@knovu.com', '$2a$12$cP6bJim3R.ib347kfRlB6O6OUrLMl9Foky4Ns5DWXSk3N2J6sNu1a', 'Jess', 'Graham', '777-777-7777');

INSERT INTO Organizations (Name)
VALUES ('B Test Org');
INSERT INTO Users (OrganizationID, Email, Password, FirstName, LastName, Phone) 
VALUES ((SELECT ID FROM Organizations WHERE Name = 'B Test Org'), 'b+test@knovu.com', '$2a$12$cP6bJim3R.ib347kfRlB6O6OUrLMl9Foky4Ns5DWXSk3N2J6sNu1a', 'Jess', 'Graham', '777-777-7777');

INSERT INTO Organizations (Name)
VALUES ('C Test Org');
INSERT INTO Users (OrganizationID, Email, Password, FirstName, LastName, Phone) 
VALUES ((SELECT ID FROM Organizations WHERE Name = 'C Test Org'), 'c+test@knovu.com', '$2a$12$cP6bJim3R.ib347kfRlB6O6OUrLMl9Foky4Ns5DWXSk3N2J6sNu1a', 'Jess', 'Graham', '777-777-7777');
