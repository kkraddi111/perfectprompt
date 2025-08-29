import type { PromptTemplateCategory } from './types';

export const PROMPT_TEMPLATES: PromptTemplateCategory[] = [
  {
    category: 'Creative Content',
    templates: [
      {
        title: 'Blog Post Outline',
        description: 'Generate a structured outline for a blog post on a specific topic.',
        prompt: `Create a detailed blog post outline for the topic: "[Your Topic Here]". The outline should include a compelling headline, an introduction with a hook, at least 3-4 main sections with sub-points, and a concluding paragraph that summarizes the key takeaways and includes a call to action.`,
      },
      {
        title: 'Social Media Post',
        description: 'Craft an engaging social media post for a specific platform.',
        prompt: `Act as a social media manager. Write an engaging post for [Platform: e.g., Twitter, LinkedIn, Instagram] about [Your Subject Here]. The tone should be [Tone: e.g., witty, professional, inspiring]. Include 2-3 relevant hashtags and a call to action.`,
      },
      {
        title: 'Short Story Idea Generator',
        description: 'Get a unique short story prompt based on a genre and a keyword.',
        prompt: `Generate a compelling short story prompt in the [Genre: e.g., sci-fi, fantasy, mystery] genre. The story must include the following keyword: "[Your Keyword Here]". The prompt should introduce a main character, a setting, and a central conflict.`,
      },
    ],
  },
  {
    category: 'Business',
    templates: [
      {
        title: 'Professional Email',
        description: 'Compose a clear and professional email for a specific purpose.',
        prompt: `Write a professional email to [Recipient's Role or Name] regarding [Subject of Email]. The email should clearly state the purpose, provide necessary context or details, and specify the desired next step or action. The tone should be formal and courteous. My name is [Your Name].`,
      },
      {
        title: 'SWOT Analysis',
        description: 'Perform a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis.',
        prompt: `Perform a SWOT analysis for a [Type of Business: e.g., small coffee shop, tech startup]. Identify at least 3 points for each category: Strengths, Weaknesses, Opportunities, and Threats. Present the output in a structured markdown table.`,
      },
      {
        title: 'Job Description',
        description: 'Create a comprehensive job description for a new role.',
        prompt: `Create a detailed job description for the role of [Job Title] at a [Company Type] company. Include a brief company overview, key responsibilities, required qualifications and skills, preferred qualifications, and information about benefits or company culture.`,
      },
    ],
  },
  {
    category: 'Code Generation',
    templates: [
      {
        title: 'Python Function',
        description: 'Generate a Python function with docstrings and examples.',
        prompt: `Write a Python function that [description of function's purpose, e.g., takes a list of integers and returns the sum of all even numbers]. Include a clear docstring explaining the parameters and what it returns. Also, provide two example use cases with expected outputs.`,
      },
      {
        title: 'SQL Query',
        description: 'Generate an SQL query to retrieve specific data from a described table.',
        prompt: `Given a database table named 'users' with columns (id, name, email, signup_date, last_login_date), write an SQL query to [your data request, e.g., find all users who signed up in the last 30 days and have not logged in since].`,
      },
    ],
  },
];
