# Star Wars Timeline

A linear galactic timeline of Star Wars events (movies/novels/comics/...)

### Usage

- Clone the repo
- Install dependencies: `npm i`
- Run: `npm run dev`
  - Now you can access your webpage at: http://localhost:8080
- To build: `npm run build`

### To update tile positions

- Show debug elements: http://localhost:8080/#debug
- Click on tile you want to update, use the following keys for update
  - `←`, `→`: horizonal position
  - `↑`, `↓`: height
  - `Q`, `E`: yearOffset
  - `A`, `D`: tileScale
  - `Z`, `C`: tileOffset
- Use export button to export the data as json
- Use `scripts/convert.py` to remove extra decimal places
- Update data file

### To add

- [Choose Your Destiny](https://starwars.fandom.com/wiki/Star_Wars:_Choose_Your_Destiny)
