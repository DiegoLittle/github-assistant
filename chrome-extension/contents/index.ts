import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";
import { githubLanguageColors } from "../utils/consts";
 
export const config: PlasmoCSConfig = {
  matches: ["https://github.com/*"],
  all_frames: true,
}

window.addEventListener("load", async () => {
  const url = document.URL.split("github.com/")[1]
  console.log('url.split("/").length', url.split("/").length);
  
  if(url.split("/").length ===2) {
    const name = url.split("/")[1]
    const owner = url.split("/")[0]
    const markdownBody = document.querySelector('.markdown-body')
    const description = markdownBody?.textContent
    const resp = await sendToBackground({
      name: "fetch",
      body: {
        "owner": owner,
        "name": name,
      },
    })
    if(resp.status === 200) {
      console.log('resp.body', resp.body);
      const aboutMargin = document.querySelector('.about-margin')
      const div = document.createElement('div')
      const getRepoHTML = (repo: any) => {
        console.log('repo', repo);
        // Make all githublanguageColors Keys lowercase
        const languageColors = Object.keys(githubLanguageColors).reduce((acc, key) => {
          acc[key.toLowerCase()] = githubLanguageColors[key]
          return acc
        }, {})
        console.log('languageColors', languageColors);
        console.log('repo.language', repo.language.toLowerCase())

        const color = languageColors[repo.language.toLowerCase()]?.color || '#000'
        const id = repo.full_name.split('/')[1]

        const capitalize = (s: string) => {
          if (typeof s !== 'string') return ''
          return s.charAt(0).toUpperCase() + s.slice(1)
        }
        
        return  `<li class="mb-3 d-flex flex-content-stretch sortable-button-item pinned-item-list-item js-pinned-item-list-item col-12">
        <div class="Box d-flex p-3 width-full public source">
          <div class="pinned-item-list-item-content">
            <div class="d-flex width-full position-relative">
              <div class="flex-1">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo mr-1 color-fg-muted">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
      </svg>
                <span data-view-component="true" class="position-relative"><a data-hydro-click="{&quot;event_type&quot;:&quot;user_profile.click&quot;,&quot;payload&quot;:{&quot;profile_user_id&quot;:96090470,&quot;target&quot;:&quot;PINNED_REPO&quot;,&quot;user_id&quot;:43286191,&quot;originating_url&quot;:&quot;https://github.com/${repo.full_name.split('/')[0]}&quot;}}"  id="${id}" href="/${repo.full_name}" data-view-component="true" class="Link mr-1 text-bold wb-break-word" aria-labelledby="tooltip-5bd5c5c7-3059-47da-97d2-2a7204e69461">
      <span class="repo">${repo.name}</span>
      </a><tool-tip id="tooltip-5bd5c5c7-3059-47da-97d2-2a7204e69461" for="${id}" popover="manual" data-direction="s" data-type="label" data-view-component="true" class="sr-only position-absolute" aria-hidden="true" role="tooltip">${repo.full_name}</tool-tip></span>          <span></span><span class="Label Label--secondary v-align-middle mt-1 no-wrap v-align-baseline Label--inline">${capitalize(repo.visibility)}</span>
              </div>
            </div>
      
      
            <p class="pinned-item-desc color-fg-muted text-small mt-2 mb-0">
              ${repo.description}
            </p>
      
            <p class="mb-0 mt-2 f6 color-fg-muted">
                <span class="d-inline-block mr-3">
        <span class="repo-language-color" style="background-color: ${color}"></span>
        <span itemprop="programmingLanguage">${repo.language}</span>
      </span>
      
                <a href="/${repo.full_name}/stargazers" class="pinned-item-meta Link--muted">
                  <svg aria-label="stars" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star">
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
      </svg>
                  ${repo.stargazers_count > 1000 ? `${(repo.stargazers_count / 1000).toFixed(1)}k` : repo.stargazers_count}
                </a>
                <a href="/${repo.full_name}/forks" class="pinned-item-meta Link--muted">
                  <svg aria-label="forks" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked">
          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
      </svg>
                  ${repo.forks_count}
                </a>
            </p>
          </div>
        </div>
      </li>`
      }
      div.className = 'BorderGrid-row'
      div.innerHTML = `
      <div
      class="BorderGrid-cell"
      >
      <h2
      class="h4 mb-3"
      >Similar Repositories</h2>
      <ul class="pinned-repos-list">
        ${resp.body.map((repo: any) => getRepoHTML(repo)).join('')}
      </ul>
      </div>
      `
      aboutMargin?.appendChild(div)
    }

    
  }
  })