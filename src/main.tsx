import InputBox from './components/InputBox.js';
import ModelSelector from './components/modelSelector.js';
import { useState } from 'react';
import { Box, Text, render, useInput } from 'ink';
import { MinglinAscii } from './createAscii.js';
import getModels from './ollama/utils.js';
import type { model, thread } from './types.js';

import ThreadSelector from './components/ThreadSelector.js';



process.stdout.write("\x1b[2J"); // clear screen

const App = () => {
    const [selectedModel, setSelectedModel] = useState<model | null>({
        name: "",
        model: "",
        modified_at: "2021-01-01",
        size: 0,
        digest: "string",
        details: {}
    });
    const [selectedThread, setSelectedThread] = useState<thread | null>(null);
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