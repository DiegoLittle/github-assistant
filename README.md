

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">
  GitHub Assistant Extension
  </h3>

  <p align="center">
    A browser extension that recommends similar repositories to the one you are currently viewing.
    <br />
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## About The Project

GitHub Assistant is a browser extension that recommends similar repositories to the one you are currently viewing. It is built using the GitHub API and the Chrome Extension API. It uses ChromaDB and SentenceTransforms to build a vector index of Github Repositories. The extension then uses this index to recommend similar repositories to the one you are currently viewing.


It is a great way to discover new repositories that are similar to the one you are currently viewing.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-blue)](https://fastapi.tiangolo.com/)
* [![ChromaDB](https://img.shields.io/badge/ChromaDB-0.1.0-blue)](
    https://github.com/chroma-core/chroma
)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
  ```sh
  git clone https://github.com/DiegoLittle/github-assistant.git
  ```
Setup and Start the API
```sh
cd api
poetry install
poetry run python -m api
  ```

Setup and Start the Extension
```sh
cd extension
npm install
npm run dev
```
Once the extension is built, you can load it into your browser by following the instructions [here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)


### Deployment
The API Can be deployed using Docker
```sh
cd api
docker-compose -f deploy/docker-compose.yml --project-directory . up --build
```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Diego Little - [@diaeygo](https://twitter.com/diaeygo) - diego@synesthesia.ai

Project Link: [https://github.com/DiegoLittle/github-assistant](https://github.com/DiegoLittle/github-assistant)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments


* [Index Storm](https://github.com/indexStorm)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


