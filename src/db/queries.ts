import db from "./db.js";
import type { thread } from "../types.js";
// queries

const getAllThreads = () => {
    const row = db.prepare("SELECT * FROM threads").all().map((row: any) => {
        return {
            thread_id: row.thread_id,
            model: row.model,
            created_at: row.created_at,
            updated_at: row.updated_at,
            messages: JSON.parse(row.messages)
        }
    });

    return row as thread[];
}

const createThread = (thread: thread) => {
    db.prepare("INSERT INTO threads (thread_id, model, created_at, updated_at, messages) VALUES (?, ?, ?, ?, ?)").run(
        thread.thread_id,
        thread.model,
        thread.created_at,
        thread.updated_at,
        JSON.stringify(thread.messages)
    );
}

const getThread = (thread_id: string) => {
    const row = db.prepare("SELECT * FROM threads WHERE thread_id = ?").get(thread_id) as any;
    if (!row) {
        return null;
    }
    return {
        thread_id: thread_id,
        model: row.model,
        created_at: row.created_at,
        updated_at: row.updated_at,
        messages: JSON.parse(row.messages)
    }
}

const deleteThread = (thread_id: string) => {
    return db.prepare("DELETE FROM threads WHERE thread_id = ?").run(thread_id);
}

const updateThread = (thread: thread) => {
    return db.prepare("UPDATE threads SET model = ?, updated_at = ?, messages = ? WHERE thread_id = ?").run(
        thread.model,
        thread.updated_at,
        JSON.stringify(thread.messages),
        thread.thread_id
    );
}

export { getAllThreads, createThread, deleteThread, updateThread, getThread };