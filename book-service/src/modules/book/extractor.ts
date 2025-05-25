import * as EPub from 'epub';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as fssync from 'fs';
import { Logger } from '@nestjs/common';

const logger = new Logger('Extractor');

export async function extractAndSaveCover(
  bookId: string,
  epubPath: string,
): Promise<void> {
  const coverPath = path.resolve('books/covers', `${bookId}.jpg`);
  logger.log(`Cover path: ${coverPath}`);
  if (fssync.existsSync(coverPath)) {
    logger.log('Cover already exists. Skipping.');
    return;
  }

  await new Promise<void>((resolve) => {
    const epub = new EPub(epubPath);

    epub.on('error', (err) => {
      logger.error(`EPUB error: ${err.message || err}`);
      resolve();
    });

    epub.on('end', () => {
      const manifest = (epub as any).manifest;
      let coverId = (epub as any).cover;

      if (!coverId) {
        for (const [id, item] of Object.entries(manifest)) {
          const lowerHref = (item as any).href?.toLowerCase();
          const lowerId = id.toLowerCase();
          if (
            lowerId.includes('cover') ||
            lowerHref?.includes('cover') ||
            (item as any).properties === 'cover-image'
          ) {
            coverId = id;
            logger.log(`Found potential coverId manually: ${coverId}`);
            break;
          }
        }
      }

      if (!coverId) {
        logger.warn(`No cover ID found for ${bookId}`);
        return resolve();
      }

      (epub as any).getImage(
        coverId,
        async (err: any, data: Buffer, mimeType: string) => {
          if (err) {
            logger.error(`getImage error: ${err.message || err}`);
            return resolve();
          }

          if (!data) {
            logger.warn(`No image data received for cover ID: ${coverId}`);
            return resolve();
          }

          try {
            await fs.writeFile(coverPath, data);
            logger.log(`Cover saved at ${coverPath}`);
          } catch (writeErr) {
            logger.error(
              `Failed to write cover: ${writeErr.message || writeErr}`,
            );
          }
          resolve();
        },
      );
    });

    epub.parse();
  });
}
