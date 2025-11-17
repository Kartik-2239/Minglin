import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { getResponse, checkOllama } from '../ollama/getResponse.js';
import type { model, chat, chat2, thread } from '../types.js';
import ChatsBox from './Chats.js';
import { nanoid } from 'nanoid';
import { createThread, updateThread, getThread } from '../db/queries.js';

process.stdout.write("\x1b[2J"); // clear screen

const InputBox = ({ selectedModel, selectedThread, setSelectedThread }: { selectedModel: model, selectedThread: thread, setSelectedThread: React.Dispatch<React.SetStateAction<thread | null>> }) => {
	const [value, setValue] = useState('');
	const [messages, setMessages] = useState<chat2[]>([]);

	const [response, setResponse] = useState<string>('');
	const [backgroundColor, setBackgroundColor] = useState<string>('red');
	const [placeholder, setPlaceholder] = useState<string>('click enter to send.....');
	const [responding, setResponding] = useState<boolean>(false);
	const inputRef = useRef<any>(null);
	const [thread_id, setThreadId] = useState<string>(selectedThread.thread_id);


	useEffect(() => {
		const existing = getThread(selectedThread.thread_id);
		if (existing !== null) {
			setMessages(existing.messages);
			setThreadId(existing.thread_id);
		} else {
			createThread({
				thread_id: selectedThread.thread_id,
				model: selectedModel.name,
				created_at: selectedThread.created_at,
				updated_at: new Date().toISOString(),
				messages: selectedThread.messages ?? []
			});
			setThreadId(selectedThread.thread_id);
			setMessages(selectedThread.messages ?? []);
		}
	}, [selectedThread]);


	useInput((input, key) => {
		if (key.return) {
			if (responding) return;
			handleResponse();
			setPlaceholder('click enter to send.....');
			setValue('');
		}
		if (key.escape) {
			setSelectedThread(null);
		}
		if (key.upArrow) {
			const userMessages = messages.filter(m => m.role === 'user');
			const curMessage = userMessages.find(m => m.content === value);
			setValue(userMessages[userMessages.indexOf(curMessage as chat2) + 1]?.content ?? '');
		}
		if (key.downArrow) {
			const userMessages = messages.filter(m => m.role === 'user');
			const curMessage = userMessages.find(m => m.content === value);
			setValue(userMessages[userMessages.indexOf(curMessage as chat2) - 1]?.content ?? '');
		}
	});

	const handleResponse = async () => {
		if (value.trim() === '') return;
		const submitted = value;
		const userNanoid = nanoid(7);
		setMessages(prev => [...prev, { role: 'user', content: submitted, chat_id: userNanoid, total_duration: 0, load_duration: 0, prompt_eval_count: 0, prompt_eval_duration: 0, eval_count: 0, eval_duration: 0 }]);
		const chatsForApi: chat2[] = [...messages, { role: 'user', content: submitted, chat_id: userNanoid, total_duration: 0, load_duration: 0, prompt_eval_count: 0, prompt_eval_duration: 0, eval_count: 0, eval_duration: 0 }];
		setBackgroundColor("green");
		const assistantNanoid = nanoid(5);
		var testRes = ""
		setResponding(true);
		// const response = await getResponse(selectedModel.name, chatsForApi);
		const isOllama = await checkOllama();
		if (!isOllama) {
			setResponding(false);
			setMessages(prev => [...prev, { role: 'assistant', content: "Error getting response from ollama, check if ollama is running", chat_id: assistantNanoid, total_duration: 0, load_duration: 0, prompt_eval_count: 0, prompt_eval_duration: 0, eval_count: 0, eval_duration: 0 }]);
			return;
		}
		try{
			for await (const chunk of getResponse(selectedModel.name, chatsForApi)) {
				const lines = chunk.split('\n').filter(Boolean);
				for (const line of lines) {
					try {
						const parsed = JSON.parse(line);
						if (parsed.done) {
							setMessages(prev => {
								const exists = prev.find(m => m.chat_id === assistantNanoid && m.role === 'assistant');
								if (exists) {
									return prev.map(m => m.chat_id === assistantNanoid ? { ...m, total_duration: parsed.total_duration, load_duration: parsed.load_duration, prompt_eval_count: parsed.prompt_eval_count, prompt_eval_duration: parsed.prompt_eval_duration, eval_count: parsed.eval_count, eval_duration: parsed.eval_duration } : m);
								}
								return [...prev, { role: 'assistant', content: testRes, chat_id: assistantNanoid, total_duration: parsed.total_duration, load_duration: parsed.load_duration, prompt_eval_count: parsed.prompt_eval_count, prompt_eval_duration: parsed.prompt_eval_duration, eval_count: parsed.eval_count, eval_duration: parsed.eval_duration }];
							});
							// setEvalCount(parsed.eval_count);
							const finalMessages: chat2[] = [
								...chatsForApi,
								{ role: 'assistant', content: testRes, chat_id: assistantNanoid, total_duration: parsed.total_duration, load_duration: parsed.load_duration, prompt_eval_count: parsed.prompt_eval_count, prompt_eval_duration: parsed.prompt_eval_duration, eval_count: parsed.eval_count, eval_duration: parsed.eval_duration }
							];
							updateThread({ // title: selectedThread.title,
								thread_id: thread_id,
								model: selectedModel.name,
								created_at: selectedThread.created_at,
								updated_at: new Date().toISOString(),
								messages: finalMessages
							});
							break;
						}
						const token = parsed?.message?.content;
						if (token) {
							testRes += token;
							setMessages(prev => {
								const exists = prev.find(m => m.chat_id === assistantNanoid && m.role === 'assistant');
								if (exists) {
									return prev.map(m => m.chat_id === assistantNanoid ? { ...m, content: testRes } : m);
								}
								return [...prev, { role: 'assistant', content: testRes, chat_id: assistantNanoid, total_duration: 0, load_duration: 0, prompt_eval_count: 0, prompt_eval_duration: 0, eval_count: 0, eval_duration: 0 }];
							});
						}
					} catch (_err) {
						// ignore partial JSON lines
					}
				}
			}
		} catch (error) {
			setResponding(false);
			return;
		}
		setResponding(false);
	}
	return (
		<Box flexDirection="column" height="auto" justifyContent="space-between">
			<Box width="100%">
				<ChatsBox response={response} chats={messages} />
			</Box>
			<Box ref={inputRef} borderStyle="round" borderColor="cyan" gap={1} justifyContent='space-between' minHeight={1} paddingX={1} flexShrink={0} width="100%">
				<Box>
					<TextInput placeholder={placeholder} value={value} onChange={setValue} />
				</Box>
			</Box>
		</Box>
	);
};


export default InputBox;