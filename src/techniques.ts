import type { PromptingTechnique } from './types';

export const FOUNDATIONAL_TECHNIQUES: PromptingTechnique[] = [
  {
    name: 'Role Prompting',
    description: 'Assigning a specific role or persona to the AI (e.g., "Act as an expert copywriter") to frame its response style, tone, and knowledge base, leading to more specialized and higher-quality output.',
    example: 'Instead of: "Write about the benefits of React."\nTry: "Act as a senior frontend developer. Write a blog post explaining the key benefits of using React for web development, targeting junior developers."',
  },
  {
    name: 'Add Context',
    description: 'Providing relevant background information, details, or constraints to help the AI understand the full scope of the request. More context reduces ambiguity and helps the model generate a more relevant and accurate response.',
    example: 'Instead of: "Summarize the document."\nTry: "Summarize the attached meeting notes. The goal is to create a list of action items for the marketing team to review before our next sync on Friday."',
  },
  {
    name: 'Few-Shot Prompting',
    description: 'Including a few examples of the desired input/output format within the prompt. This helps the AI learn the pattern you want it to follow, which is especially useful for structured data or specific stylistic tasks.',
    example: 'Prompt: "Translate the following English phrases to French in a formal tone.\n\nEnglish: Hello, how are you?\nFrench: Bonjour, comment allez-vous?\n\nEnglish: Thank you very much.\nFrench: Merci beaucoup.\n\nEnglish: See you later.\nFrench:"',
  },
  {
    name: 'Add Constraints',
    description: 'Setting specific limitations or requirements for the output, such as word count, format, what to include, or what to avoid. This gives you more control over the final result and prevents generic or overly broad answers.',
    example: 'Instead of: "Write a story about a dragon."\nTry: "Write a short story (under 300 words) about a friendly dragon who is afraid of heights. Do not include any knights or princesses."',
  },
  {
    name: 'Specify Format',
    description: 'Clearly instructing the AI on how to structure its response. Ask for markdown tables, JSON objects, bullet points, or numbered lists to get easily parsable and well-organized output.',
    example: 'Instead of: "List the pros and cons of remote work."\nTry: "List the pros and cons of remote work. Present your answer in a markdown table with two columns: \'Pros\' and \'Cons\'.',
  },
   {
    name: 'Information Retrieval',
    description: "Crafting prompts to efficiently search the LLM's knowledge base for relevant and accurate information. This involves using specific keywords and clear, direct questions.",
    example: 'Instead of: "Tell me about space."\nTry: "What are the three most significant discoveries made by the Hubble Space Telescope since its launch in 1990?"',
  },
  {
    name: 'Summarization',
    description: 'Guiding the LLM to distill long or complex information into concise summaries. You can specify the desired length, format, and focus of the summary to get the most important information quickly.',
    example: 'Instead of just pasting a long article, try: "Summarize the key findings of the attached scientific paper in three bullet points, focusing on the implications for public health."',
  },
  {
    name: 'Iterative Prompting',
    description: "Breaking down a complex task into a sequence of smaller, manageable prompts. This creates a conversation with the AI, allowing you to build on previous responses and refine the final output step-by-step.",
    example: 'Instead of: "Write a complete business plan for a new coffee shop."\nTry starting with: "First, help me define the mission and vision for a new specialty coffee shop." Then follow up with: "Great. Now, based on that mission, suggest three unique selling propositions."',
  },
];

export const ADVANCED_TECHNIQUES: PromptingTechnique[] = [
    {
    name: 'Chain-of-Thought (CoT)',
    description: 'Encouraging the AI to "think step-by-step" by explaining its reasoning before giving the final answer. This improves performance on complex logical or multi-step tasks by revealing the model\'s thought process.',
    example: 'Instead of: "If a train leaves Station A at 3 PM traveling at 60 mph..."\nTry: "Solve the following logic problem. First, break the problem down into individual steps. Explain your reasoning for each step. Finally, provide the final answer."',
  },
  {
    name: 'Least-to-Most Prompting',
    description: "A strategy for solving complex problems by first asking the AI to solve simpler sub-problems. You start with a general prompt and incrementally add details, guiding the model to a more specialized and accurate solution.",
    example: 'For a complex coding problem, first ask: "What are the main components required for a user authentication system?"\nThen, get more specific: "Write the Python code for the user registration component using Flask and SQLAlchemy."',
  },
  {
    name: 'Self-Ask Prompting',
    description: "An advanced technique where the AI is prompted to ask itself clarifying questions to break down a problem. This mimics human critical thinking and helps the model arrive at a more reasoned solution by exploring the problem space.",
    example: 'Prompt: "If I want to build a birdhouse, what are the key factors I need to consider? For each factor, ask a follow-up question that would help you give a better, more detailed answer."',
  },
];