import { scrapeSources } from "../services/scrapeSources";
import { getCronSources } from "../services/getCronSources";
import { generateDraft } from "../services/generateDraft";
import { sendDraft } from "../services/sendDraft";

export const handleCron = async (): Promise<void> => {
  try {
    const cronSources = await getCronSources();
    const rawStories = await scrapeSources(cronSources);
    const rawStoriesString = JSON.stringify(rawStories, null, 2);
    const draftPost = await generateDraft(rawStoriesString);

    // Outline of outputs/handoffs
    const outline = [
      '==== Trend Finder Output Outline ====',
      `Sources Monitored (${cronSources.length}):`,
      ...cronSources.map((src: any) => (src.identifier ? `  - ${src.identifier}` : `  - ${JSON.stringify(src)}`)),
      '',
      'Raw Stories:',
      rawStoriesString,
      '',
      'AI-Generated Draft:',
      draftPost,
      '',
      '==== End of Output Outline ====',
      '',
    ].join('\n');

    const result = await sendDraft(outline);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
