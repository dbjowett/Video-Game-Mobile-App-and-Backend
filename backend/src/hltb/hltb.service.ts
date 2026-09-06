import { Injectable, Logger } from '@nestjs/common';
import { CompletionTimes } from '@vg/types';
import { HowLongToBeat } from 'howlongtobeat-core';
import { getErrorMessage } from 'src/common/utils';

// Unofficial scraper wrapper, isolated here so it's a one-file swap to fork/replace/rip out.
// KNOWN BROKEN as of 2026-09-05: howlongtobeat.com/api/search/init 404s, always falls through to undefined.
@Injectable()
export class HltbService {
  private readonly logger = new Logger(HltbService.name);
  private readonly hltb = new HowLongToBeat();

  async getCompletionTimes(gameName: string): Promise<CompletionTimes | undefined> {
    try {
      const results = await this.hltb.search(gameName);
      const match = results?.[0];
      if (!match) return undefined;

      return {
        mainStory: match.mainStory ?? undefined,
        mainExtra: match.mainExtra ?? undefined,
        completionist: match.completionist ?? undefined,
      };
    } catch (error) {
      this.logger.warn(`HowLongToBeat lookup failed for "${gameName}": ${getErrorMessage(error)}`);
      return undefined;
    }
  }
}
