import { Box, Text, useInput } from 'ink';
import getModels from '../ollama/utils.js';
import { useState, useEffect } from 'react';
import React from 'react';
import type { thread } from '../types.js';
import { createThread, deleteThread, getAllThreads } from '../db/queries.js';
import { nanoid } from 'nanoid';



const ThreadSelector = ({ setSelectedThread }: { setSelectedThread: React.Dispatch<React.SetStateAction<thread | null>> }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [threads, setThreads] = useState<thread[]>([]);
    const [newThread, setNewThread] = useState<thread | null>(null);

    useEffect(() => {
        const all = getAllThreads();
        if (all.length === 0) {
            const newThreadId = nanoid(7);
            const initialThread: thread = {
                thread_id: newThreadId,
                model: "mistral:7b",
                created_at: "2021-01-01",
                updated_at: "2021-01-01",
                messages: []
            };
            createThread(initialThread);
            setThreads([initialThread]);
            setNewThread(initialThread);
        } else {
            setThreads(all);
        }

    }, []);

    useInput((input, key) => {
        if (key.ctrl && input == "n") {
            const newThread = {
                // title: "New Thread",
                thread_id: nanoid(7),
                model: "mistral:7b",
                created_at: "2021-01-01",
                updated_at: "2021-01-01",
                messages: []
            }
            setThreads([
                ...threads,
                newThread
            ]);
            setSelectedThread(newThread);

        }
        if (key.ctrl && input === "d") {
            console.log("delete", threads[selectedIndex]);
            if (!threads[selectedIndex]) return;
            deleteThread(threads[selectedIndex].thread_id);
            setThreads(threads.filter(thread => thread.thread_id !== threads[selectedIndex]?.thread_id));
        }
        if (key.downArrow) {
            if (selectedIndex == threads.length - 1) {
                setSelectedIndex(0);
            } else {
                setSelectedIndex(selectedIndex + 1);
            }
        } else if (key.upArrow) {
            if (selectedIndex == 0) {
                setSelectedIndex(threads.length - 1);
            } else {
                setSelectedIndex(selectedIndex - 1);
            }
        } else if (key.return) {
            if (threads[selectedIndex]) {
                setSelectedThread(threads[selectedIndex]);
                process.stdout.write("\x1b[2J");
            } else {
                if (newThread) {
                    setSelectedThread(newThread);
                }
            }
        }
    });
    
    // useEffect(() => {
    //     getModels().then(setThreads);
    // }, []);
    if (threads.length === 0) {
        return (
            <></>
        )
    }
    return (
        <Box alignSelf='flex-start' borderStyle="round" width="25%" flexDirection='column' padding={1}>
            {threads.map((thread: thread, index: number) =>{return (
                <Box key={thread.thread_id} backgroundColor={index === selectedIndex ? "cyan" : "transparent"}>
                    <Text>{thread.messages[0]?.content.slice(0, 10)}...</Text>
                    {/* <Text>{thread.title}</Text> */}
                </Box>
            )})}
        </Box>
    )
}

export default ThreadSelector;