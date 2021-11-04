import * as send_text_to_vrc from "send_text_to_vrc"
import Parser from 'rss-parser';

export async function reddit(files: Array<send_text_to_vrc.File>) {
    let file = new send_text_to_vrc.File("reddit.com", ["title", "author", "published"]);

    const parser: Parser<{}, { author: string | undefined }> = new Parser({
        customFields: {
            // feed: [],
            item: ['author']
        }
    });

    const feed = await parser.parseURL('https://www.reddit.com/.rss');

    feed.items.forEach(item => {
        let title = item.title ? item.title : "";
        let author = item.author ? item.author : "";
        let published = item.pubDate ? item.pubDate : "";

        file.push([title, author, published]);
    });

    files.push(file);
}