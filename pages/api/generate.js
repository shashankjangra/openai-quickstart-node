import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const brandName = req.body.brandName || '';
  const brandDescription = req.body.brandDescription || '';
  if (brandName.trim().length === 0 || brandDescription.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please provide a valid brand name and description",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-babbage-001",
      prompt: generatePrompt(brandName, brandDescription),
      temperature: 0.6,
      max_tokens: 50,
      n: 4,
    });

    const taglines = completion.data.choices.map((choice) => choice.text.trim());
    res.status(200).json({ taglines });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(brandName, brandDescription) {
  return `Generate four tagline suggestions for a brand. The brand names that are generated should be so good that the customers are able to reacall the brand easily.
  The data you return needs to be in the format:
  1. Tagline 1
  2. Tagline 2

Brand Name: ${brandName}
Brand Description: ${brandDescription}

Taglines:`;
}
