import Database from "better-sqlite3";

const db : Database.Database = new Database("minglin.sqlite");

// Create table
db.exec(`
CREATE TABLE IF NOT EXISTS threads (
    thread_id TEXT NOT NULL PRIMARY KEY,
    model TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    messages JSON NOT NULL
);    
`);


// Insert
const insert = db.prepare("INSERT INTO threads (thread_id, model, created_at, updated_at, messages) VALUES (?, ?, ?, ?, ?)");
// insert.run("123", "mistral:7b", "2021-01-01", "2021-01-01", JSON.stringify([{ role: "user", content: "Hello, how are you?" }]));
// insert.run("456", "mistral:7b", "2021-01-01", "2021-01-01", JSON.stringify([{ role: "user", content: "test 2" }]));
// insert.run("789", "mistral:7b", "2021-01-01", "2021-01-01", JSON.stringify([{ role: "user", content: "testß 3" }]));
// insert.run("101", "mistral:7b", "2021-01-01", "2021-01-01", JSON.stringify([{ role: "user", content: "test 4" }]));
// insert.run("123", "mistral:7b", "2021-01-01", "2021-01-01", JSON.stringify([{ role: "user", content: "test 5" }]));

// Select
// const rows = db.prepare("SELECT * FROM threads").all();
// console.log(rows);

export default db;
