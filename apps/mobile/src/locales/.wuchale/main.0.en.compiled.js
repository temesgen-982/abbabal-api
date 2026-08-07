
                /** @type import('wuchale').CompiledElement[] */
export let c = ["Home","Search","Random","Saved","Profile","አባባል","Amharic Proverbs","Proverb","Close menu","Failed to load proverbs. Please try again.","Retry","Remove from saved","Save proverb",["You've seen all ",0," proverbs 🎉"],"Back to top","Remove all saved proverbs?","አባባል — Amharic Proverbs. Preserve wisdom. Share culture.","Share Abbabal",["Version ",0],"Saved proverbs","Share the app","Clear saved proverbs",[[0]," Preserve wisdom. Share culture."],[0,"\n\n\"",1,"\"\n\nvia አባባል"],[0,"\n\nvia አባባል"],"Failed to load proverb.","Go back","Amharic","Translation","Meaning","ትርጉም","Failed to load proverb. Please try again.",[[0]," Share"],[[0]," New Proverb"],"No saved proverbs","Tap the bookmark on a proverb to save it here for offline reading.","Explore proverbs",[0," saved"],"Search failed. Please try again.","Search Amharic or English...","No results","Try searching in Amharic or English",[0," results"],"Search proverbs","Search in Amharic or English","Open menu","Switch language","Toggle theme","Abbabal","የእውቀት ቃላት"]
                // only during dev, for HMR
                let latestVersion = -1
                // @ts-ignore
                export function update({ version, data }) {
                    if (latestVersion >= version) {
                        return
                    }
                    for (const [ index, item ] of data['en'] ?? []) {
                        c[index] = item
                    }
                    latestVersion = version
                }
            