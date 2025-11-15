import { Box, Text, useInput } from 'ink';
import getModels from '../ollama/utils.js';
import { useState, useEffect } from 'react';
import React from 'react';
import type { model } from '../types.js';



const ModelSelector = ({ setSelectedModel }: { setSelectedModel: React.Dispatch<React.SetStateAction<model | null>> }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [models, setModels] = useState<model[]>([]);

    useInput((_, key) => {
        if (key.downArrow) {
            if (selectedIndex == models.length - 1) {
                setSelectedIndex(0);
            } else {
                setSelectedIndex(selectedIndex + 1);
            }
        } else if (key.upArrow) {
            if (selectedIndex == 0) {
                setSelectedIndex(models.length - 1);
            } else {
                setSelectedIndex(selectedIndex - 1);
            }
        } else if (key.return) {
            if (models[selectedIndex]) {
                setSelectedModel(models[selectedIndex]);
                process.stdout.write("\x1b[2J");
            } else {
                setSelectedModel(null);
            }
        }
    });
    
    useEffect(() => {
        getModels().then(setModels);
    }, []);
    if (models.length === 0) {
        return (
            <></>
        )
    }
    return (
        <Box alignSelf='flex-start' borderStyle="round" flexDirection='column' padding={1}>
            {models.map((model: model, index: number) =>{return (
                <Box key={model.name} backgroundColor={index === selectedIndex ? "cyan" : "transparent"}>
                    <Text>{model.name}</Text>
                </Box>
            )})}
        </Box>
    )
}

export default ModelSelector;