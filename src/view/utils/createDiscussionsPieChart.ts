import { createPieChart, createTable } from "./common";
import { Collection } from "../../converters/types";
import { getValueAsIs } from "../../common/utils";

export const createDiscussionsPieChart = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  if (getValueAsIs("USE_CHARTS") === "true") {
    return users
      .map((user) => ({ user, values: data[user][date]?.discussionsTypes }))
      .filter(
        (types) =>
          types.values &&
          Object.values(types.values).some((value) => value.received?.total)
      )
      .map((data) => {
        const values = Object.entries(data.values!)
          .filter(([key, value]) => value.received?.total)
          .reduce((acc, value) => {
            return {
              ...acc,
              [value[0]]: value[1].received?.total,
            };
          }, {});
        return createPieChart(
          `Discussion's types ${data.user} ${date}`,
          values
        );
      })
      .join("\n");
  }
  const headers = Object.keys(data.total[date]?.discussionsTypes || {});
  if (headers.length === 0) return "";
  const userRows = users
    .filter(
      (user) =>
        data[user][date]?.discussionsTypes &&
        Object.values(data[user][date]?.discussionsTypes!).some(
          (value) => value.received?.total
        )
    )
    .map((user) => [
      `**${user}**`,
      ...headers.map(
        (header) =>
          data[user][date]?.discussionsTypes?.[
            header
          ]?.received?.total?.toString() || "0"
      ),
    ]);
  return createTable({
    title: `Discussion's types ${date}`,
    description: "",
    table: { headers: ["users", ...headers], rows: userRows },
  });
};
