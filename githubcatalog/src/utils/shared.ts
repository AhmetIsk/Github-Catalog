/**
 * Builds a search query for the GitHub GraphQL API.
 * @param username - The username to search for.
 * @param nameFilter - The name filter to apply.
 * @param languageFilter - The language filter to apply.
 * @returns The search query.
 */
export const buildSearchQuery = (username: string, nameFilter?: string, languageFilter?: string[]) => {
  let query = `user:${username}`;

  if (nameFilter) {
    query += ` ${nameFilter}`;
  }

  if (languageFilter && languageFilter.length > 0) {
    const languagesQuery = languageFilter.map(lang => `language:${lang}`).join(' ');
    query += ` ${languagesQuery}`;
  }

  return query;
};