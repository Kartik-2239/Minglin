import { Box, Text } from 'ink';
import type { chat2 } from '../types.js';

const ChatsBox = ({response, chats}: {response:string, chats:chat2[]}) => {
    return (
        <Box minHeight={1} width="100%" flexDirection="column" >
            {
                chats.map((chat) => (
                        chat.role === 'user' ? (
                            <Box key={chat.chat_id} borderStyle="round" borderColor="cyan" paddingX={1} width="auto" alignSelf='flex-end'>
                                <Text key={chat.chat_id}>{chat.content}</Text>
                            </Box>
                        ) : (
                            <Box key={chat.chat_id} borderStyle="round" borderColor="red" paddingX={1} width="80%" flexDirection="column" alignSelf='flex-start'>
                                <Text key={chat.chat_id}>{chat.content}</Text>
                                {chat.eval_count > 0 && <Box borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} borderStyle="single" borderColor="cyan">
                                    <Text>Tokens: {chat.eval_count}, Tokens/sec: {(chat.eval_count / chat.eval_duration * 1000000000).toFixed(2) || 0}</Text>
                                </Box>}
                            </Box>
                        )
                ))
            }
            {/* <Text>response: {response}</Text> */}
        </Box>
    )
}

export default ChatsBox;