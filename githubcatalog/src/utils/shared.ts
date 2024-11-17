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