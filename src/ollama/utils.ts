import type { model } from '../types.js';

async function getModels() {
    try{
        const response = await fetch('http://localhost:11434/api/tags')
        return await response.json().then((models: { models: model[] }) => {
            return models.models
        })
    }
    catch (error) {
        console.error("Models not found, check if ollama is running")
        process.exit(1);
    }
    
}

export default getModels

// getModels().then(models => {
//     console.log(models)
//     if (models !== "ERROR") {
//         models.forEach((model: model) => {
//             console.log(model.name)
//         })
//     }
// })