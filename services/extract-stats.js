import * as cheerio from "cheerio";

function extractStats(html) {
  const $ = cheerio.load(html);

  const detailsDiv = $("div.d-flex.flex__fl-equal.fw-wrap.gs24").first();
  const badgeDivs = detailsDiv.find("div.fs-title");

  let goldBadges = detailsDiv.find("div.badge-gold").text().trim();
  let silverBadges = detailsDiv.find("div.badge-silver").text().trim();
  let bronzeBadges = detailsDiv.find("div.badge-bronze").text().trim();

  // If class names are not found or not reliable, use text content as a fallback
  if (!goldBadges || !silverBadges || !bronzeBadges) {
    const badges = [];
    badgeDivs.each((i, el) => {
      const text = $(el).text().trim();
      badges.push({
        type: text.toLowerCase().split(" ")[0], // Extract badge type (gold, silver, bronze)
        count: text.split(" ")[1], // Extract badge count
      });
    });

    const userBadges = badges.reduce((acc, badge) => {
      acc[badge.type] = badge.count || 0; // Default count to 0 if undefined
      return acc;
    }, {});

    goldBadges = userBadges.gold || "0";
    silverBadges = userBadges.silver || "0";
    bronzeBadges = userBadges.bronze || "0";
  }

  return {
    username: $(".flex--item.mb12.fs-headline2.lh-xs").text().trim(),
    reputation: $("div.fs-body3.fc-black-600").eq(0).text().trim(),
    peopleReached: $("div.fs-body3.fc-black-600").eq(1).text().trim(),
    answers: $("div.fs-body3.fc-black-600").eq(2).text().trim(),
    goldBadges,
    silverBadges,
    bronzeBadges,
  };
}

export default extractStats;
