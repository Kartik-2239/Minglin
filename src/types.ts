export type model = {
    name: string,
    model: string,
    modified_at: string,
    size: number,
    digest: string,
    details: any
}

export type chat = {
    role: string,
    content: string,
    uuid: string,
}

export type chat2 = {
    role: string,
    content: string,
    image_base64?: string,
    chat_id: string,
    total_duration: number,
    load_duration: number,
    prompt_eval_count: number,
    prompt_eval_duration: number,
    eval_count: number,
    eval_duration: number
}

export type thread = {
    thread_id: string,
    // title: string,
    model: string,
    created_at: string,
    updated_at: string,
    messages: chat2[]
}