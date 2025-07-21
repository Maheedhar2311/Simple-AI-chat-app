# Simple Chat UI for local LLM
This project is a clean,light-weight, and self-contained front-end chat interface built with plain HTML,CSS and JavaScript.
It is designed to connect to a locally running instance of Ollama and interact with the large language model llama3.

🚀 Features
- Connects directly to a local Ollama API endpoint.
- Clean UI for displaying user prompts and AI responses.
- Toggle between light and dark modes, with the user's preference saved locally.
- Conversations are automatically saved to and loaded from your browser's local storage.
- A button that allows you to delete entire chat history.
- Visual indicator(dots) is shown while model is generating a response.
- Easily copy the AI's response to your clipboard with a single click.

To setup the local AI model (Ollama)
1. Install Ollama : If you haven't already, download or install Ollama from [ollama.com](https://ollama.com/)
2. Download a model :  You need to have a model available for the chat to work. This project defaults to llama3.
3. Open your terminal or command prompt and run: ollama pull llama3
4. Run the Ollama Server: Ensure the Ollama application is running in the background.
   It will automatically handle requests on http://localhost:11434, which is the endpoint this application uses.

📁 Project Structure
project/
├── index.html             # Main HTML file
├── styles.css             # Base styles
├── script.js              # JavaScript for user-interactivity
├── images                 # All images used
└── README.md              # Documentation file
