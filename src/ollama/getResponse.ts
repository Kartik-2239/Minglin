type errorResponse = {
    "error": string,
    "status_code": number,
    "name": string,
}
import type {chat2} from '../types.js';

// type response = {
//     "model": string,
//     "created_at": string,
//     "messages": {
//         "role": string,
//         "content": string,
//     }[],
//     "done": boolean
// }

async function* getResponse(model: string, chats: chat2[]) {
    // const message = { role: 'user', content: 'Why is the sky blue?' }
    const messages = chats.map(chat => ({ role: chat.role, content: chat.content }));
    try{
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: true,
            }),
        })
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No readable stream from response");
        var running = true;
        while (running) {
            const { done, value } = await reader.read();
            if (done) {
                running = false;
                yield decoder.decode(value), { stream: true };
                break;
            };
            const chunk = decoder.decode(value, { stream: true });
            yield chunk;
        }
    }catch (error) {
        return {
            "error": "Error getting response from ollama, check if ollama is running"
        }
    }
    
}

async function checkOllama() {
    try{
        const response = await fetch('http://localhost:11434/api/tags')
    }
    catch (error) {
        return false;
    }
    return true;
}


export {getResponse, checkOllama}

// var z = ""
// for await (const part of getResponse('dolphin-phi:latest', [{ role: 'user', content: 'What is the meaning of life?', uuid: '123' }])) {
//     try{
//         z += JSON.parse(part)
//         if (JSON.parse(part).done === true) {
//             console.log(part);
//         }
//     } catch (error) {
//     }
// }