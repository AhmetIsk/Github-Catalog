import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_REPOS } from "../graphql/queries/getUserRepos";

const RepositorySearch: React.FC = () => {
  const [username, setUsername] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  const { data, loading, error } = useQuery(GET_USER_REPOS, {
    variables: { username },
    skip: !username,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Please enter a GitHub username.");
      return;
    }
  };

  const filteredRepos = data?.user.repositories.nodes.filter((repo: any) => {
    // Apply name and language filters
    const matchesName = repo.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesLanguage = languageFilter
      ? repo.primaryLanguage?.name.toLowerCase() === languageFilter.toLowerCase()
      : true;
    return matchesName && matchesLanguage;
  });

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {data && (
        <div>
          <input
            type="text"
            placeholder="Filter by repository name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by language"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          />
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {filteredRepos && (
        <ul>
          {filteredRepos.map((repo: any) => (
            <li key={repo.id}>
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <p>Language: {repo.primaryLanguage?.name || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RepositorySearch;
