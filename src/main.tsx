#!/usr/bin/env node
import InputBox from './components/InputBox.js';
import ModelSelector from './components/modelSelector.js';
import { useState } from 'react';
import { Box, Text, render, useInput } from 'ink';
import { MinglinAscii } from './createAscii.js';
import getModels from './ollama/utils.js';
import type { model, thread } from './types.js';
import { getThread, updateThread } from './db/queries.js';
import { useEffect } from 'react';
import ThreadSelector from './components/ThreadSelector.js';



process.stdout.write("\x1b[2J"); // clear screen

const App = () => {
    // const model = await getModels().then(models => models[0]);
    const [selectedModel, setSelectedModel] = useState<model | null>(null);
    const [selectedThread, setSelectedThread] = useState<thread | null>(null);

    // useEffect(() => {
    //     if (!selectedModel) {
    //         const thread = getThread(selectedThread?.thread_id ?? "");
    //         if (!thread) return;
    //         setSelectedModel(thread.model);
    //     };
    //     const thread = getThread(selectedThread?.thread_id ?? "");
    //     if (thread) {
    //         updateThread({
    //             thread_id: thread.thread_id,
    //             model: selectedModel?.name ?? "",
    //             created_at: thread.created_at,
    //             updated_at: new Date().toISOString(),
    //             messages: thread.messages
    //         });
    //     }
    // }, [selectedModel])

    useEffect(()=>{
        // console.log(selectedThread?.model)
        setSelectedModel({
            name: selectedThread?.model ?? "",
            model: selectedThread?.model ?? "",
            modified_at: "2021-01-01",
            size: 0,
            digest: "string",
            details: {}
        });
    }, [selectedThread])

    useEffect(()=>{
        setSelectedThread({
            thread_id: selectedThread?.thread_id ?? "",
            model: selectedModel?.name ?? "",
            created_at: selectedThread?.created_at ?? "",
            updated_at: new Date().toISOString(),
            messages: selectedThread?.messages ?? []
        });
    }, [selectedModel])

    useInput((input, key) => {
        if (key.meta && input == "i") {
            console.log("input", input);
            setSelectedModel(null);
        }
        if (key.shift && key.rightArrow) {
            getModels().then(models => {
                if (!models || models.length === 0) return;
                // If nothing selected yet, start at first
                if (!selectedModel) {
                    const firstModel = models[0];
                    if (!firstModel) return;
                    setSelectedModel(firstModel);
                    return;
                }
                const currentIndex = models.findIndex(m => m.name === selectedModel.name);
                const safeIndex = currentIndex >= 0 ? currentIndex : 0;
                const nextIndex = (safeIndex + 1) % models.length;
                const nextModel = models[nextIndex];
                if (!nextModel) return;
                setSelectedModel(nextModel);
            });
        }
        if (key.shift && key.leftArrow) {
            getModels().then(models => {
                if (!models || models.length === 0) return;
                // If nothing selected yet, start at first
                if (!selectedModel) {
                    const firstModel = models[0];
                    if (!firstModel) return;
                    setSelectedModel(firstModel);
                    return;
                }
                const currentIndex = models.findIndex(m => m.name === selectedModel.name);
                const safeIndex = currentIndex >= 0 ? currentIndex : 0;
                const prevIndex = (safeIndex - 1 + models.length) % models.length;
                const prevModel = models[prevIndex];
                if (!prevModel) return;
                setSelectedModel(prevModel);
            });
        }
    });
    return (
        <>
            <Box width="100%">
				<Text color={'cyan'}>{MinglinAscii}</Text>
			</Box>
            {selectedThread ? null :<Box paddingX={1} paddingY={1} flexDirection='column'>
                <Text color={'cyan'}>Ctrl + n to create a new thread</Text>
                <Text color={'cyan'}>Ctrl + d to delete a thread</Text>
            </Box>}
            
            {/* {selectedModel ? null : <ModelSelector setSelectedModel={setSelectedModel} />} */}
            {selectedThread ? null : <ThreadSelector setSelectedThread={setSelectedThread} />}
            {selectedThread && selectedModel && 
                <>
                    <InputBox setSelectedThread={setSelectedThread} selectedModel={selectedModel} selectedThread={selectedThread} />
                </>
            }
            {selectedModel && <Text color={'cyan'}> {`>> model :`} <Text color={'green'}>[ {selectedModel?.name} ]</Text> {"(switch with shift + arrow keys)"}</Text>}
        </>
    )
}

render(<App />);