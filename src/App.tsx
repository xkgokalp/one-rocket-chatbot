import React, { useState } from "react"

import "./App.css"
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
	MainContainer,
	ChatContainer,
	MessageList,
	Message,
	MessageInput,
	TypingIndicator,
	Avatar,
} from "@chatscope/chat-ui-kit-react"

import { systemMessage } from "./constants/index"

import chatBot from "./assets/chatbot.jpg"

export interface IMessage {
	message: string
	sender: string
}
export const API_KEY = "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"

function App() {
	const [typing, setTyping] = useState<boolean>(false)
	const [role, setRole] = useState<string>("user")
	const [messages, setMessages] = useState<any[]>([
		{
			message: "Hello, I am OneRocket Chatbot. How can I help you?",
			sender: "Chatbot",
			sentTime: "just now",
		},
	])

	async function handleSend(message: any) {
		const newMessage = {
			message,
			sender: "user",
			direction: "outgoing",
		}

		const newMessages = [...messages, newMessage]

		setMessages(newMessages)

		setTyping(true)

		await processMessageToChatbot(newMessages)
	}

	async function processMessageToChatbot(chatMessages: any) {
		let apiMessages = chatMessages.map((messageObject: any) => {
			let role = ""
			if (messageObject.sender === "Chatbot") {
				role = "assistant"
			} else {
				role = "user"
			}
			setRole(role)
			return { role: role, content: messageObject.message }
		})

		const apiRequestBody = {
			model: "gpt-3.5-turbo",
			messages: [systemMessage, ...apiMessages],
		}

		await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(apiRequestBody),
		})
			.then((data) => {
				return data.json()
			})
			.then((data) => {
				console.log(data)
				console.log(data.choices[0].message.content)
				setMessages([
					...chatMessages,
					{
						message: data.choices[0].message.content,
						sender: "Chatbot",
					},
				])
				setTyping(false)
			})
	}

	return (
		<div className="container">
			<div className="chatbot-container">
				<MainContainer className="chatbot-chat-container">
					<ChatContainer>
						<MessageList
							scrollBehavior="smooth"
							typingIndicator={
								typing ? (
									<TypingIndicator content="Chatbot is typing" />
								) : null
							}
						>
							{messages.map((message, index) => {
								return (
									<Message key={index} model={message}>
										{message.sender !== "user" ? (
											<Avatar
												src={chatBot}
												name="Eliot"
											/>
										) : (
											<Avatar
												src={
													"https://w7.pngwing.com/pngs/529/832/png-transparent-computer-icons-avatar-user-profile-avatar.png"
												}
												name="Eliot"
											/>
										)}
									</Message>
								)
							})}
						</MessageList>
						<MessageInput
							placeholder="Type your message here"
							onSend={handleSend}
						/>
					</ChatContainer>
				</MainContainer>
			</div>
		</div>
	)
}

export default App
