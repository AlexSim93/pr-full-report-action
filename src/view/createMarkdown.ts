import { Collection } from "../converters/types";
import {
  createConfigParamsCode,
  createPullRequestQualityTable,
  createReviewTable,
  createTimelineContent,
  createTotalTable,
} from "./utils";
import { getMultipleValuesInput } from "../common/utils";

export const createMarkdown = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  dates: string[],
  title: string = "Pull Request report"
) => {
  const contentTypes = getMultipleValuesInput("SHOW_STATS_TYPES");

  const content = dates.map((date) => {
    if (!data.total[date]?.merged) return "";

    const contentMap: Record<string, string> = {
      timeline: createTimelineContent(data, users, date),
      workload: createTotalTable(data, users, date),
      "code-review-engagement": createReviewTable(data, users, date),
      "pr-quality": createPullRequestQualityTable(data, users, date),
    };

    return `
    ${contentTypes
      .map((type) => contentMap[type])
      .filter((content) => content)
      .join("\n")}
    `;
  });

  if (content.join("").trim() === "") return "";

  return `
## ${title}
This report based on ${
    data.total?.total?.closed || 0
  } last updated PRs. To learn more about the project and its configuration, please visit [Pull request analytics action](https://github.com/AlexSim93/pull-request-analytics-action).
  ${createConfigParamsCode()}
    ${content.join("\n")}
  `;
};
