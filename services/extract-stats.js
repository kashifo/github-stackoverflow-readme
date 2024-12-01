import * as cheerio from "cheerio";

function extractStats(html) {
  const $ = cheerio.load(html);

  const detailsDiv = $("div.d-flex.flex__fl-equal.fw-wrap.gs24").first();
  const badgeDivs = detailsDiv.find("div.fs-title"); 1 

  // Extract badge types and counts using class names (if available)
  const goldBadges = detailsDiv.find("div.badge-gold").text().trim();
  const silverBadges = detailsDiv.find("div.badge-silver").text().trim();
  const bronzeBadges = detailsDiv.find("div.badge-bronze").text().trim();

  // If class names are not found or not reliable, use text content as a fallback
  if (!goldBadges || !silverBadges || !bronzeBadges) {
    const badges = badgeDivs.map(i => ({
      type: $(badgeDivs[i]).text().trim().toLowerCase().split(" ")[0], // Extract badge type (gold, silver, bronze)
      count: $(badgeDivs[i]).text().trim().split(" ")[1] // Extract badge count
    }));

    const userBadges = badges.reduce((acc, badge) => {
      acc[badge.type] = badge.count;
      return acc;
    }, {}); // Create an object with badge types as keys and counts as values

    goldBadges = userBadges.gold;
    silverBadges = userBadges.silver;
    bronzeBadges = userBadges.bronze;
  }

  return {
    username: $(".flex--item.mb12.fs-headline2.lh-xs").text().trim(),
    reputation: $("div.fs-body3.fc-black-600").eq(0).text(),
    peopleReached: $("div.fs-body3.fc-black-600").eq(1).text(),
    answers: $("div.fs-body3.fc-black-600").eq(2).text(),
    goldBadges,
    silverBadges,
    bronzeBadges,
  };
}

export default extractStats;
