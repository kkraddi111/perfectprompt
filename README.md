# PerfectPrompt ✨

> An intelligent tool that transforms basic user prompts into optimized, high-quality prompts that generate significantly better AI outputs.

PerfectPrompt is a web-based tool designed to help users craft effective prompts for AI models. It analyzes a user's basic input, suggests actionable improvements, and then applies the selected changes to generate a superior prompt.

## 🚀 Key Features

*   **📝 Interactive Enhancement:** Enter a prompt and receive a list of actionable suggestions for improvement from the Gemini AI.
*   **✅ Review & Apply:** You have full control. Review the suggestions, select the ones you like, and apply them to generate the final enhanced prompt.
*   **🎨 Category-Specific Tuning:** Select a category (e.g., Code Generation, Creative Writing) to tailor the enhancement process for your specific needs.
*   **🔍 Changes Analysis:** Get a clear, bulleted list of the specific improvements made to your prompt.
*   **💾 Local History:** Your past 50 enhancements are automatically saved in your browser's local storage for easy access.
*   **☀️/🌙 Light & Dark Mode:** A sleek, responsive design that adapts to your preferred theme.
*   **✂️ Copy & Test:** Easily copy the enhanced prompt or test it directly within the app to see the generated output from Gemini.
*   **📚 Prompt Library:** Get started quickly with a curated library of prompt templates for various use cases.


## 🛠️ Built With

*   **Framework:** [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **AI Model:** [Google Gemini API](https://ai.google.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## 🏃 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need [Node.js](https://nodejs.org/) installed on your computer. This will also install `npm`, the Node package manager.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_REPOSITORY_URL>
    cd perfectprompt
    ```

2.  **Install dependencies:**
    This project uses an `importmap` in `index.html` for its dependencies, so a traditional `npm install` is not required for the libraries themselves. However, you'll need a local development server to run the project. We recommend using a simple tool like `live-server`.
    ```sh
    npm install -g live-server
    ```

3.  **Set up your API Key:**
    The application loads the Google Gemini API key from environment variables. You will need to provide your key for the enhancement feature to work.

    *   **Important:** This project is configured to use a build tool that makes `process.env.API_KEY` available on the client-side. When setting this up for production, use a tool like Vite or Create React App and follow their documentation for handling environment variables securely.

    *   For local development, you can create a temporary file to inject the key. Create a file named `env.js` in the project root:
        ```javascript
        // env.js
        window.process = {
          env: {
            API_KEY: 'YOUR_GEMINI_API_KEY_HERE'
          }
        };
        ```

    *   Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    *   Add the script to your `index.html` **before** the main module script:
        ```html
        <!-- index.html -->
        </head>
        <body class="bg-slate-100 dark:bg-slate-900">
          <div id="root"></div>
          <script src="env.js"></script> <!-- Add this line -->
          <script type="module" src="index.tsx"></script> <!-- Your main script -->
        </body>
        </html>
        ```
    *   **Note:** Remember to add `env.js` to your `.gitignore` file to avoid committing your secret key.

4.  **Run the application:**
    Start the local development server from your project root.
    ```sh
    live-server
    ```
    This will automatically open the application in your default web browser.

## 📂 Project Structure

```
/
├── components/         # Feature-specific React components
│   ├── icons/          # SVG icon components
│   ├── ui/             # Reusable, generic UI components (Button, Card, etc.)
│   ├── Header.tsx
│   ├── HistoryPanel.tsx
│   ├── PromptEditor.tsx  # Main controller component
│   ├── PromptForm.tsx    # Component for prompt input
│   ├── PromptResultView.tsx # Component for displaying results
│   └── ...
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── services/           # API interaction logic
│   └── geminiService.ts
├── App.tsx             # Main application component
├── constants.ts        # Application-wide constants
├── index.html          # Main HTML entry point
├── index.tsx           # React application root
└── types.ts            # TypeScript type definitions
```