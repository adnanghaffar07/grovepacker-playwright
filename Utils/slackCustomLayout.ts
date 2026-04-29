import { Block, KnownBlock } from '@slack/types';
import { SummaryResults } from 'playwright-slack-report/dist/src';
import { WebClient } from '@slack/web-api';
import fs from 'fs';

const slackClient = new WebClient(process.env.SLACK_BOT_USER_OAUTH_TOKEN);

export async function uploadFile(filePath: string) {
  try {
    const result = await slackClient.files.uploadV2({
      channel_id: process.env.SLACK_CHANNEL_ID,
      file: fs.createReadStream(filePath),
      filename: filePath,
    });

    console.log(JSON.stringify(result));
    return result;
  } catch (error) {
    console.log('🔥🔥 error', error);
  }
}

export async function generateCustomLayoutSimpleMeta(
  summaryResults: SummaryResults,
): Promise<Array<KnownBlock | Block>> {
  // const meta: { type: string; text: { type: string; text: string } }[] = [];
  // if (summaryResults.meta) {
  //   for (let i = 0; i < summaryResults.meta.length; i += 1) {
  //     const { key, value } = summaryResults.meta[i];
  //     meta.push({
  //       type: 'section',
  //       text: {
  //         type: 'mrkdwn',
  //         text: `\n*${key}* :\t${value}`,
  //       },
  //     });
  //   }
  // }

  let flakyTestCases;
  if (summaryResults.flaky !== undefined) {
    flakyTestCases = summaryResults.flaky;
  }
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Playwright Automation Report of Groove Packer*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          summaryResults.failed === 0
            ? `:tada: All ${
                summaryResults.passed + flakyTestCases
              } tests passed!`
            : `✅ *${summaryResults.passed}* | ❌ *${summaryResults.failed}* | ⏩ *${summaryResults.flaky}*`,
      },
    },
  ];
}
