import fs from 'fs/promises';
import path from 'path';

// Writes the draft_post to trend_results.txt in the project root
export async function sendDraft(draft_post: string) {
  const filePath = path.resolve(__dirname, '../../trend_results.txt');
  try {
    await fs.writeFile(filePath, draft_post, 'utf-8');
    return `Draft written to ${filePath}`;
  } catch (error) {
    console.error('Error writing draft to file:', error);
    throw error;
  }
}