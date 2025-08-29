# PerfectPrompt ✨

> An intelligent tool that transforms basic user prompts into optimized, high-quality prompts that generate significantly better AI outputs.

PerfectPrompt is a web-based tool designed to help users craft effective prompts for AI models. It analyzes a user's basic input, suggests actionable improvements, and then applies the selected changes to generate a superior prompt.

## 🚀 Key Features

*   **🔑 User-Provided API Key:** Securely add your own Google Gemini API key directly in the app's settings. Your key is stored only in your browser's local storage.
*   **📝 Interactive Enhancement:** Enter a prompt and receive a list of actionable suggestions for improvement from the Gemini AI, categorized by prompting technique.
*   **✅ Review & Apply:** You have full control. Review the suggestions, select the ones you like, and apply them to generate the final enhanced prompt.
*   **🎨 Category-Specific Tuning:** Select a category (e.g., Code Generation, Creative Writing) and a target model to tailor the enhancement process for your specific needs.
*   **🔍 Changes Analysis:** Get a clear, bulleted list of the specific improvements made to your prompt.
*   **💡 Learn Techniques:** An integrated library teaches foundational and advanced prompting techniques with clear explanations and examples.
*   **💾 Local History:** Your past 50 enhancements are automatically saved in your browser's local storage for easy access.
*   **☀️/🌙 Light & Dark Mode:** A sleek, responsive design that adapts to your preferred theme.
*   **▶️ Test Prompt:** Instantly test your newly enhanced prompt directly within the app to see the generated output from Gemini.
*   **📚 Prompt Library:** Get started quickly with a curated library of prompt templates for various use cases.


## 🛠️ Built With

*   **Framework:** [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **AI Model:** [Google Gemini API](https://ai.google.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## 🏃 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need [Node.js](https://nodejs.org/) (version 18 or newer recommended) installed on your computer. This will also install `npm`, the Node package manager.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_REPOSITORY_URL>
    cd perfectprompt
    ```

2.  **Install dependencies:**
    This will install React, Vite, and all other necessary packages.
    ```sh
    npm install
    ```

3.  **Run the application:**
    Start the local development server.
    ```sh
    npm run dev
    ```
    This will automatically open the application in your default web browser.

4.  **Add your API Key:**
    *   Once the application is running, click the **Settings** icon (⚙️) in the header.
    *   Paste your Google Gemini API Key into the input field and click "Save". You can get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   The key is now saved in your browser's local storage, and you can start enhancing prompts.

### Building for Production

When you are ready to deploy, you can create an optimized build of the application.

1.  **Run the build command:**
    ```sh
    npm run build
    ```
2.  This will create a `dist` directory with all the static files (HTML, CSS, JS) needed for deployment. You can upload the contents of this folder to any static web hosting service.

## 📂 Project Structure

```
/
├── src/                  # All application source code
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API interaction logic
│   ├── App.tsx           # Main application component
│   ├── constants.ts
│   ├── index.tsx         # React application root
│   └── types.ts
├── index.html            # Main HTML entry point for Vite
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build tool configuration
```

## 🧹 Project Cleanup

After refactoring the project to use Vite, the following files and folders from the old structure are no longer needed and can be safely deleted to clean up the project root:

*   `index.tsx` (at root level)
*   `App.tsx` (at root level)
*   `types.ts` (at root level)
*   `constants.ts` (at root level)
*   `templates.ts` (at root level)
*   `techniques.ts` (at root level)
*   `/components/` (the entire directory at root level)
*   `/hooks/` (the entire directory at root level)
*   `/services/` (the entire directory at root level)

All source code now resides within the `/src/` directory, as shown in the structure diagram above.
