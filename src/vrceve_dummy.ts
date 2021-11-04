import * as send_text_to_vrc from "send_text_to_vrc"
import { LoremIpsum } from "lorem-ipsum";
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

export async function vrceve(files: Array<send_text_to_vrc.File>) {
    let file = new send_text_to_vrc.File("vrceve.com", [
        "summary",
        "start",
        "end",
        "host",
        "desc",
        "genre",
        "cond",
        "join",
        "other"
    ]);

    let titleList = [
        [
            "【Quest 対応】",
            "",
            "",
            "",
        ],
        [
            "かにたま",
            "カニのしっぽ",
            "えびぱん",
            "async",
            "ほに",
            "ネコミミスタヂオ",
            "クリアファイル",
            "するめいか",
            "芋掘り",
            "ゴママヨ",
            "lorem-ipsum"
        ],
        [
            "アバター集会",
            "について語る会",
            "集会",
            "交流会",
            "ユーザー会",
        ]
    ];

    const howtojoinList = [
        "mewl hayabusaにフレンド申請してJoin",
        "時間になったらPublicのインスタンスへ",
        ""
    ];

    const genreList = [
        "アバター試着会",
        "改変アバター交流会",
        "その他交流会",
        "VR飲み会",
        "店舗系イベント",
        "音楽イベント",
        "ロールプレイ",
        "初心者向けイベント",
        "定期イベント",
    ];

    let start = new Date();
    start.setHours(start.getHours() - 1);
    start.setMinutes(0);

    for (let i = 0; i < 50; i++) {
        start.setHours(start.getHours() + Math.random());
        start.setMinutes(start.getMinutes() + Math.random() * 120);

        let end = new Date();
        end.setTime(start.getTime());
        end.setHours(end.getHours() + Math.random() * 2);
        end.setMinutes(end.getMinutes() + Math.random() * 60);

        let summary = titleList[0][Math.ceil((Math.random() * titleList[0].length)) - 1] + titleList[1][Math.ceil((Math.random() * titleList[1].length)) - 1] + titleList[2][Math.ceil((Math.random() * titleList[2].length)) - 1];
        let host = "mewl hayabusa";
        let desc = lorem.generateSentences(1) + "\n" + lorem.generateSentences(1);
        let genre = genreList[Math.ceil((Math.random() * genreList.length)) - 1];
        let cond = lorem.generateSentences(1);
        let howtojoin = howtojoinList[Math.ceil((Math.random() * howtojoinList.length)) - 1];
        let other = "これはダミーのデータで、定期的に再生成されます";

        file.push([
            summary,
            start.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
            end.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
            host,
            desc,
            genre,
            cond,
            howtojoin,
            other,
        ]);
    }

    files.push(file);
}
