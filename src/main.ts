import * as send_text_to_vrc from "send_text_to_vrc"

import { weahter_jma } from "./weahter_jma.js";
import { vrceve } from "./vrceve_dummy.js";
import { reddit } from "./reddit.js";

async function meta(files: Array<send_text_to_vrc.File>) {
    const file = new send_text_to_vrc.File("meta", ["updated", "contact"]);
    file.push([(new Date()).toISOString(), "mailto:info@nekomimi.studio / ActivityPub @mewl@mewl.me / Twitter @mewl_me"]);
    files.push(file);
}

(async () => {
    let files: Array<send_text_to_vrc.File> = [];

    await Promise.all([
        meta(files),
        reddit(files),
        weahter_jma(files),
        vrceve(files)
    ]);

    send_text_to_vrc.publish(files, "/var/www/toVRC/list.webm");
})();
